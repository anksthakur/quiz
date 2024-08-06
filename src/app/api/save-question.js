// pages/api/quizes.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { questionData, subjectId, category } = req.body;

    const dbPath = path.resolve('db.json');

    try {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

      // Ensure the subject exists in the data
      const quiz = dbData.quizes.find(q => q.id === subjectId);
      if (!quiz) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      // Ensure the category exists in the subject
      if (!quiz.questions) {
        quiz.questions = [];
      }

      // Add the new question to the appropriate category
      quiz.questions.push(questionData);

      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');

      res.status(200).json({ message: 'Question saved successfully!' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
