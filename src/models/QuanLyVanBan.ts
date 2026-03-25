import { useLocalStorage } from '@/utils/useLocalStorage';
import { useMemo } from 'react';


export default function useQuanLyVanBangModel() {
  const [diplomaBooks, setDiplomaBooks] = useLocalStorage<DiplomaBook[]>('qlvb_diplomaBooks', []);
  const [decisions, setDecisions] = useLocalStorage<GraduationDecision[]>('qlvb_decisions', []);
  const [formConfigs, setFormConfigs] = useLocalStorage<FormConfig[]>('qlvb_formConfigs', []);
  const [diplomas, setDiplomas] = useLocalStorage<Diploma[]>('qlvb_diplomas', []);
  const [searchStats, setSearchStats] = useLocalStorage<Record<string, number>>('qlvb_searchStats', {});

  const decisionMap = useMemo(() => 
    new Map(decisions.map(d => [d.id, d])), [decisions]
  );

  const generateId = () => crypto.randomUUID?.() || Date.now().toString();

  const addDiplomaBook = (book: Omit<DiplomaBook, 'id' | 'currentNumber'>) => {
    setDiplomaBooks(prev => [...prev, { ...book, id: generateId(), currentNumber: 1 }]);
  };

  const updateDiplomaBook = (id: string, data: Partial<DiplomaBook>) => {
    setDiplomaBooks(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const addDecision = (decision: Omit<GraduationDecision, 'id'>) => {
    setDecisions(prev => [...prev, { ...decision, id: generateId() }]);
  };

  const addDiploma = (diploma: Omit<Diploma, 'id' | 'bookNumber'>) => {
    const decision = decisionMap.get(diploma.decisionId);
    if (!decision) return console.error("Không tìm thấy Quyết định");

    setDiplomaBooks(prevBooks => {
      const bookIndex = prevBooks.findIndex(b => b.id === decision.diplomaBookId);
      if (bookIndex === -1) return prevBooks;

      const targetBook = prevBooks[bookIndex];
      const nextNumber = targetBook.currentNumber;

      const newDiploma: Diploma = {
        ...diploma,
        id: generateId(),
        bookNumber: nextNumber
      };

      setDiplomas(prevDiplomas => [...prevDiplomas, newDiploma]);

      const newBooks = [...prevBooks];
      newBooks[bookIndex] = { ...targetBook, currentNumber: nextNumber + 1 };
      return newBooks;
    });
  };

  const incrementSearchStat = (decisionId: string) => {
    setSearchStats(prev => ({
      ...prev,
      [decisionId]: (prev[decisionId] || 0) + 1
    }));
  };

  return {
    diplomaBooks, decisions, formConfigs, diplomas, searchStats,
    actions: {
      book: { add: addDiplomaBook, update: updateDiplomaBook, remove: (id: string) => setDiplomaBooks(p => p.filter(b => b.id !== id)) },
      decision: { add: addDecision, remove: (id: string) => setDecisions(p => p.filter(d => d.id !== id)) },
      diploma: { add: addDiploma, remove: (id: string) => setDiplomas(p => p.filter(d => d.id !== id)) },
      config: { 
        add: (c: Omit<FormConfig, 'id'>) => setFormConfigs(p => [...p, { ...c, id: generateId() }]),
        remove: (id: string) => setFormConfigs(p => p.filter(c => c.id !== id))
      },
      incrementSearchStat
    }
  };
}