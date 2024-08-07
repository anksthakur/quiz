import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('db.json');

export default function handler(req, res) {
  try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    if (req.method === 'POST') {
      const { questionData, subjectId } = req.body;

      // Validate input
      if (!questionData || !subjectId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Find the subject by its ID
      const subject = dbData.quizes.find(q => q.id === subjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      // Initialize questions array if it doesn't exist
      if (!subject.questions) {
        subject.questions = [];
      }

      // Check if questionData.id is already used
      const existingQuestion = subject.questions.find(q => q.id === questionData.id);
      if (existingQuestion) {
        return res.status(400).json({ message: 'Question ID already exists' });
      }

      // Add the new question to the subject's questions array
      subject.questions.push(questionData);

      // Write updated data back to the db.json file
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');

      res.status(200).json({ message: 'Question saved successfully!' });

    } else if (req.method === 'PUT') {
      const { id, questionData } = req.body;

      // Validate input
      if (!id || !questionData) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Find the subject by question's subjectId
      const subject = dbData.quizes.find(q => q.id === questionData.subjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      // Find the question and update it
      const questionIndex = subject.questions.findIndex(q => q.id === id);
      if (questionIndex === -1) {
        return res.status(404).json({ message: 'Question not found' });
      }

      subject.questions[questionIndex] = questionData;

      // Write updated data back to the db.json file
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');

      res.status(200).json({ message: 'Question updated successfully!' });

    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      // Validate input
      if (!id) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Find the subject by question's ID
      const subject = dbData.quizes.find(q => q.questions && q.questions.some(q => q.id === id));
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      // Remove the question from the subject's questions array
      subject.questions = subject.questions.filter(q => q.id !== id);

      // Write updated data back to the db.json file
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');

      res.status(200).json({ message: 'Question deleted successfully!' });

    } else {
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
