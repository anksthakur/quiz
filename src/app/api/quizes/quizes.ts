import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.resolve('db.json');

// Define types for quiz and question data
interface Question {
  number: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  answer: string;
  marks: string;
}

interface Quiz {
  id: number;
  subject: string;
  questions?: Question[];
}

interface DbData {
  quizes: Quiz[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dbData: DbData = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

    if (req.method === 'POST') {
      const { questionData, subjectId }: { questionData: Question; subjectId: number } = req.body;

      if (!questionData || subjectId === undefined) {
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
      const { questionData, subjectId }: { questionData: Question; subjectId: number } = req.body;

      if (!questionData || subjectId === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const subject = dbData.quizes.find(q => q.id === subjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      const questionIndex = subject.questions?.findIndex(q => q.number === questionData.number);
      if (questionIndex === undefined || questionIndex === -1) {
        return res.status(404).json({ message: 'Question not found' });
      }

      if (subject.questions) {
        subject.questions[questionIndex] = questionData;
      }

      await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
      res.status(200).json({ message: 'Question updated successfully!' });

    } else if (req.method === 'DELETE') {
      const { subjectId, number } = req.query;

      const parsedSubjectId = parseInt(subjectId as string, 10);
      const parsedNumber = parseInt(number as string, 10);

      if (isNaN(parsedSubjectId) || isNaN(parsedNumber)) {
        return res.status(400).json({ message: 'Missing or invalid required fields' });
      }

      const subject = dbData.quizes.find(q => q.id === parsedSubjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      if (!subject.questions) {
        return res.status(404).json({ message: 'No questions found for this subject' });
      }

      const updatedQuestions = subject.questions.filter(q => q.number !== parsedNumber);
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
