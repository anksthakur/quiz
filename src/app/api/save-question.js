
export default function handler(req, res) {
    if (req.method === 'POST') {
      // Extract the question data from the request body
      const { question, options, answer ,marks } = req.body;
  
      //  log the question data
      console.log('Received question data:', { question, options, answer ,marks});
  
      // Respond with a success message
      res.status(200).json({ message: 'Question saved successfully!' });
    } else {
      // Handle any non-POST requests
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  