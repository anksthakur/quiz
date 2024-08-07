export default function handler(req, res) {
  try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    if (req.method === 'POST') {
      const { questionData, subjectId } = req.body;

      if (!questionData || !subjectId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      dbData.quizes.push({ ...questionData, subjectId });
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');

      res.status(200).json({ message: 'Question saved successfully!' });

    } else if (req.method === 'PUT') {
      const { id, questionData, subjectId } = req.body;

      if (!id || !questionData || !subjectId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const questionIndex = dbData.quizes.findIndex(q => q.id === id && q.subjectId === subjectId);
      if (questionIndex === -1) {
        return res.status(404).json({ message: 'Question not found' });
      }

      dbData.quizes[questionIndex] = { ...questionData, id, subjectId };
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');

      res.status(200).json({ message: 'Question updated successfully!' });

    } else if (req.method === 'DELETE') {
      const { subjectId, number } = req.query;

      if (!subjectId || isNaN(Number(number))) {
        return res.status(400).json({ message: 'Missing or invalid required fields' });
      }

      const updatedQuizes = dbData.quizes.filter(q => q.subjectId !== subjectId || q.questionData.number !== Number(number));
      if (updatedQuizes.length === dbData.quizes.length) {
        return res.status(404).json({ message: 'Question not found' });
      }

      dbData.quizes = updatedQuizes;
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');

      res.status(200).json({ message: 'Question deleted successfully!' });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
