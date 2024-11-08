import Note from './_components/note';

interface NotePageProps {
  params: Promise<{ noteId: string }>;
}

const NotePage = async ({ params }: NotePageProps) => {
  const { noteId } = await params;
  return <Note noteId={noteId} />;
};

export default NotePage;
