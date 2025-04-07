
import { useApp } from '@/context/AppContext';
import SubjectList from '@/components/subjects/SubjectList';
import SubjectDetail from '@/components/subjects/SubjectDetail';

const SubjectsPage = () => {
  const { activeSubject } = useApp();
  
  return activeSubject ? <SubjectDetail /> : <SubjectList />;
};

export default SubjectsPage;
