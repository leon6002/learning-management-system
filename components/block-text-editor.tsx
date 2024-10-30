"use client";

import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import List from "@editorjs/list";
import editorjsCodecup from "@calumk/editorjs-codecup";
import Table from "@editorjs/table";
import { useEffect, useRef } from "react";

type Props = {
  holder: string;
  placeholder: string;
  data: any;
  onChangeData: (content: OutputData) => void;
};
const EDITOR_TOOLS = {
  header: {
    //@ts-ignore
    class: Header,
    shortcut: "CMD+SHIFT+H",
    config: {
      placeholder: "Enter a header",
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 3,
    },
    // inlineToolbar: ["marker", "link"],
  },
  quote: {
    //@ts-ignore
    class: Quote,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+O",
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
  },

  linkTool: {
    class: LinkTool,
    config: {
      endpoint: "http://localhost:8008/fetchUrl", // Your backend endpoint for url data fetching,
    },
  },
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
        byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
      },
    },
  },
  list: {
    //@ts-ignore
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  code: editorjsCodecup,
  table: {
    //@ts-ignore
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
      maxRows: 5,
      maxCols: 5,
    },
  },
};
const BlockTextEditor = ({
  holder,
  placeholder,
  data,
  onChangeData,
}: Props) => {
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
        readOnly: false,
        autofocus: true,
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

  // editor.isReady
  //   .then(() => {
  //     console.log("Editor.js is ready to work!");
  //     /** Do anything you need after editor initialization */
  //   })
  //   .catch((reason) => {
  //     console.log(`Editor.js initialization failed because of ${reason}`);
  //   });

  // editor.readOnly.toggle();

  // const handleSaveData = async () => {
  //   try {
  //     const outputData = await editor.save();
  //     console.log("Article data: ", outputData);
  //   } catch (error) {
  //     console.log("Saving failed: ", error);
  //   }
  // };

  return (
    <div>
      {/* <div>
        <Button onClick={handleSaveData}>save</Button>
      </div> */}
      <div
        id={holder}
        style={{
          width: "100%",
          minHeight: 500,
          borderRadius: " 7px",
          background: "fff",
        }}
      ></div>
    </div>
  );
};

export default BlockTextEditor;
