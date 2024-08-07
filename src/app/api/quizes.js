import fs from 'fs/promises';
import path from 'path';

const dbPath = path.resolve('db.json');

export default async function handler(req, res) {
  try {
    const dbData = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

    if (req.method === 'POST') {
      const { questionData, subjectId } = req.body;

      if (!questionData || !subjectId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const subject = dbData.quizes.find(q => q.id === subjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      if (!subject.questions) {
        subject.questions = [];
      }

      subject.questions.push(questionData);

      await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
      res.status(200).json({ message: 'Question saved successfully!' });

    } else if (req.method === 'PUT') {
      const { questionData, subjectId } = req.body;

      if (!questionData || !subjectId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const subject = dbData.quizes.find(q => q.id === subjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      const questionIndex = subject.questions.findIndex(q => q.number === questionData.number);
      if (questionIndex === -1) {
        return res.status(404).json({ message: 'Question not found' });
      }

      subject.questions[questionIndex] = questionData;

      await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
      res.status(200).json({ message: 'Question updated successfully!' });

    } else if (req.method === 'DELETE') {
      const { subjectId, number } = req.query;

      if (!subjectId || isNaN(Number(number))) {
        return res.status(400).json({ message: 'Missing or invalid required fields' });
      }

      const subject = dbData.quizes.find(q => q.id === subjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      const updatedQuestions = subject.questions.filter(q => q.number !== Number(number));
      if (updatedQuestions.length === subject.questions.length) {
        return res.status(404).json({ message: 'Question not found' });
      }

      subject.questions = updatedQuestions;

      await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
      res.status(200).json({ message: 'Question deleted successfully!' });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
