'use client';

import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import LinkTool from '@editorjs/link';
import ImageTool from 'editorjs-tool-image';
import Quote from '@editorjs/quote';
import List from '@editorjs/list';
import editorjsCodecup from '@calumk/editorjs-codecup';
import Table from '@editorjs/table';
import { useEffect, useRef, useState } from 'react';
import Delimiter from '@editorjs/delimiter';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import ColorPlugin from 'editorjs-text-color-plugin';
import { MDImporter, MDParser } from 'editorjs-md-parser';
import EJLaTeX from 'editorjs-tool-latex';
import { Button } from './ui/button';
import { FaReadme } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';

type Props = {
  holder: string;
  placeholder: string;
  data: any;
  readonly: { state: boolean; toggle: boolean };
  autofocus?: boolean;
  onChangeData: (content: OutputData) => void;
};
const EDITOR_TOOLS = {
  header: {
    //@ts-ignore
    class: Header,
    shortcut: 'CMD+SHIFT+H',
    inlineToolbar: true,
    config: {
      placeholder: 'Enter a header',
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 3,
    },
  },
  quote: {
    //@ts-ignore
    class: Quote,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+O',
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: "Quote's author",
    },
  },
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: '/api/parse/link', // Your backend endpoint for url data fetching,
    },
  },
  Marker: {
    class: Marker,
    shortcut: 'CMD+SHIFT+M',
  },
  Color: {
    class: ColorPlugin,
    config: {
      colorCollections: [
        '#EC7878',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#0070FF',
        '#03A9F4',
        '#00BCD4',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FF1300',
        '#FFF',
      ],
      defaultColor: '#FF1300',
      type: 'text',
      customPicker: false, // add a button to allow selecting any colour
    },
  },

  inlineCode: {
    class: InlineCode,
    shortcut: 'CMD+SHIFT+M',
  },
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: `${process.env.NEXT_PUBLIC_HOST}/api/upload/image`, // Your backend file uploader endpoint
        byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
      },
      features: {
        border: false,
        caption: true,
        stretch: true,
        background: false,
      },
      captionPlaceholder: '在这里输入图片标题',
    },
  },
  list: {
    //@ts-ignore
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered',
    },
  },
  code: editorjsCodecup,
  delimiter: Delimiter,
  Math: {
    class: EJLaTeX,
    shortcut: 'CMD+SHIFT+M',
    config: {
      css: '.math-input-wrapper{display:flex;flex-direction:column;width:100%;padding:5px;row-gap:4px}.math-preview{min-height:50px;width:100%;padding:10px;border:1px solid #d3d3d3;border-radius:4px;font-size:20px;text-align:center}.math-preview *{font-family:Katex_Math}.math-input{ border:1px solid #d3d3d3; background:0 0; width:100%; padding:5px 10px; margin-top:5px; font-weight:light; font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace; font-size:14px; border-radius:4px; -webkit-border-radius:; -moz-border-radius:; -ms-border-radius:; -o-border-radius:; }.errorMessage{color:red}',
    },
  },
  table: {
    //@ts-ignore
    class: Table,
    inlineToolbar: true,
    config: {
      withHeadings: true,
      rows: 2,
      cols: 3,
      maxRows: 200,
      maxCols: 20,
    },
  },
};

const BlockTextEditor = ({
  holder,
  placeholder,
  data,
  readonly,
  autofocus,
  onChangeData,
}: Props) => {
  const [readOnlyState, setReadOnlyState] = useState(readonly.state);
  if (!readonly) {
    // @ts-ignore
    (EDITOR_TOOLS['markdownParser'] = {
      class: MDParser,
      config: {
        filename: 'test',
        timestamp: true,
        callback: (blocksData: any) => {
          console.log('Callback MDParser', blocksData);
        },
      },
    }),
      // @ts-ignore
      (EDITOR_TOOLS['markdownImporter'] = {
        class: MDImporter,
        config: {
          append: true,
          extensions: ['md', 'txt'],
          callback: (blocksData: any) => {
            console.log('Callback MDImporter', blocksData);
          },
        },
      });
  }
  //add a reference to editor
  const ref = useRef();
  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        /**
         * Id of Element that should contain the Editor
         */
        holder: holder,
        //@ts-ignore
        tools: EDITOR_TOOLS,
        placeholder: placeholder,
        // inlineToolbar: ["link", "marker", "bold", "italic"],
        readOnly: readonly.state,
        autofocus: autofocus || false,
        data,
        async onChange(api, event) {
          const content = await api.saver.save();
          console.log(content);
          onChangeData(content);
        },
      });
      //@ts-ignore
      ref.current = editor;
    }
    //add a return function handle cleanup
    return () => {
      //@ts-ignore
      if (ref.current && ref.current.destroy) {
        //@ts-ignore
        ref.current.destroy();
      }
    };
  }, []);

  const toggleReadOnly = async () => {
    if (ref.current) {
      //@ts-ignore
      const result = await ref.current.readOnly.toggle();
      // console.log('toggle:', result);
      setReadOnlyState(result);
    }
  };

  return (
    <div className='relative w-full flex justify-center'>
      {readonly.toggle && (
        <div className='absolute left-0 -top-20 w-full'>
          <div className='w-full max-w-[650px] mx-auto flex justify-end'>
            <Button onClick={toggleReadOnly}>
              {readOnlyState ? <FaReadme /> : <FaEdit />}
              {readOnlyState ? '阅读模式' : '编辑模式'}
            </Button>
          </div>
        </div>
      )}
      <div
        id={holder}
        className='prose prose:max-w-full prose-code:text-slate-600 prose-pre:bg-transparent dark:text-white dark:prose-headings:text-white w-full min-h-[300px]'
      ></div>
    </div>
  );
};

export default BlockTextEditor;
