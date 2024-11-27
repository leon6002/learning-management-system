import SimpleCourseBody from './_components/simple-course';

interface NotePageProps {
  params: Promise<{ courseId: string }>;
}

const NotePage = async ({ params }: NotePageProps) => {
  const { courseId } = await params;
  return <SimpleCourseBody courseId={courseId} />;
};

export default NotePage;
