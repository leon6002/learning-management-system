'use client';

import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import LinkTool from '@editorjs/link';
import ImageTool from '@editorjs/image';
import Quote from '@editorjs/quote';
import List from '@editorjs/list';
import editorjsCodecup from '@calumk/editorjs-codecup';
import Table from '@editorjs/table';
import { useEffect, useRef } from 'react';
import Delimiter from '@editorjs/delimiter';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import ColorPlugin from 'editorjs-text-color-plugin';
import { MDImporter, MDParser } from 'editorjs-md-parser';
import EJLaTeX from 'editorjs-tool-latex';

type Props = {
  holder: string;
  placeholder: string;
  data: any;
  readonly?: boolean;
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
    // @ts-ignore
    EDITOR_TOOLS['image'] = {
      class: ImageTool,
      config: {
        endpoints: {
          byFile: `${process.env.NEXT_PUBLIC_HOST}/api/upload/image`, // Your backend file uploader endpoint
          byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
        },
        features: {
          border: true,
          caption: true,
          stretch: false,
        },
        caption: 'hello',
        captionPlaceholder: '输入图片描述',
      },
    };
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
        readOnly: readonly || false,
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

  return (
    <div className='w-full flex justify-center'>
      <div
        id={holder}
        className='prose prose:max-w-full prose-code:text-slate-600 prose-pre:bg-transparent dark:text-white dark:prose-headings:text-white w-full min-h-[300px]'
      ></div>
    </div>
  );
};

export default BlockTextEditor;
