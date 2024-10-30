"use client";

import AddNoteModal from "@/components/modals/add-note-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Note } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NoteItem from "./note-item";
import dynamic from "next/dynamic";
import { OutputData } from "@editorjs/editorjs";
//@ts-ignore
let BlockTextEditor = dynamic(() => import("@/components/block-text-editor"), {
  ssr: false,
});

interface Props {
  courseId: string;
  chapterId: string;
  userId: string;
}

const Notes = ({ courseId, chapterId, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [content, setContent] = useState("");
  const [editorContent, setEditorContent] = useState<any>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState<Note[]>();
  const [isNeedRefresh, setIsNeedRefresh] = useState(false);

  // useEffect(() => {
  //   async function autoSave() {
  //     if (!isEditing) {
  //       return;
  //     }
  //     setTimeout(() => {
  //       console.log("setTimeout isEditing: ", isEditing);
  //       if (isEditing) {
  //         console.log("save...");
  //         handleSaveContent(); // 自动保存函数
  //         setIsEditing(false);
  //       }
  //     }, 5000);
  //   }
  //   autoSave();
  // }, [editorContent]);
  let timeoutId: string | number | NodeJS.Timeout | undefined = undefined;
  const handleEditorChange = (event: any) => {
    setEditorContent(event);
    // setIsEditing(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      handleSaveContent(event);
    }, 3000);
  };

  const handleSaveContent = async (content: OutputData) => {
    console.log("handleSaveContent");
    console.log("saving congent", content);
    await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/notes`, {
      content: JSON.stringify(content),
    });
  };

  // const onAdd = async () => {
  //   try {
  //     setIsLoading(true);

  //     await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/notes`, {
  //       content,
  //     });

  //     setIsNeedRefresh(true);

  //     toast.success("Note added");
  //   } catch (error) {
  //     toast.error("Something went wrong, please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `/api/courses/${courseId}/chapters/${chapterId}/notes`
        );
        console.log("res is: ", res);
        const data = res.data;
        if (data && data.length > 0) {
          setEditorContent(JSON.parse(data[0].content));
        } else {
          setEditorContent({});
        }
        // setNotes(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        // setIsNeedRefresh(false);
      }
    })();
  }, [chapterId, courseId]);

  return (
    <div className="mt-14">
      <Separator />

      <div className="p-4 flex flex-col md:flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold mb-2">我的笔记</h2>

        {/* <AddNoteModal onAdd={onAdd} content={content} setContent={setContent}> */}
        {/* <Button
          size={"sm"}
          // disabled={isLoading}
          onClick={() => {
            console.error(editorContent);
          }}
        >
          保存笔记
        </Button> */}
        {/* </AddNoteModal> */}
      </div>

      <div className="p-4">
        {/* {!notes?.length && (
          <p className="text-gray-500">{`You don't have any notes yet.`}</p>
        )} */}

        {/* {!!notes?.length &&
          notes.map((note) => (
            <NoteItem
              setIsNeedRefresh={setIsNeedRefresh}
              key={note.id}
              data={note}
              courseId={courseId}
              chapterId={chapterId}
            />
          ))} */}
        {editorContent !== undefined && (
          <BlockTextEditor
            //@ts-ignore
            holder="editor_create"
            placeholder="在这里输入笔记"
            data={editorContent}
            onChangeData={(e) => handleEditorChange(e)}
          />
        )}
      </div>
    </div>
  );
};

export default Notes;
