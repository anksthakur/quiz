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
      const existingQuestion = subject.questions.find(q => q.number === questionData.number);
      if (existingQuestion) {
        return res.status(400).json({ message: 'Question number already exists' });
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
      const questionIndex = subject.questions.findIndex(q => q.number === questionData.number);
      if (questionIndex === -1) {
        return res.status(404).json({ message: 'Question not found' });
      }

      subject.questions[questionIndex] = questionData;

      // Write updated data back to the db.json file
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');

      res.status(200).json({ message: 'Question updated successfully!' });

    } else if (req.method === 'DELETE') {
        const { subjectId, number } = req.query;
        console.log('Received DELETE request with:', { subjectId, number });
        
        // Convert number to number type
        const num = Number(number);
        
        // Validate input
        if (!subjectId || isNaN(num)) {
          return res.status(400).json({ message: 'Missing or invalid required fields' });
        }
        
        // Find the subject by subjectId
        const subject = dbData.quizes.find(q => q.id === subjectId);
        if (!subject) {
          return res.status(404).json({ message: 'Subject not found' });
        }
        
        // Find and remove the question
        const initialLength = subject.questions.length;
        subject.questions = subject.questions.filter(q => q.number !== num);
        
        if (subject.questions.length === initialLength) {
          return res.status(404).json({ message: 'Question not found' });
        }
        
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
