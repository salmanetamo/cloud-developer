import bodyParser from 'body-parser';
import express from 'express';
import { Response, Request } from 'express';
import {filterImageFromURL, deleteLocalFiles, isValidUrl} from './util/util';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url } = req.query;
    // Check url is present
    if (!image_url) {
      return res.status(400).send({ message: 'Image URL is required' });
    }

    // check url is valid
    if (!isValidUrl(image_url)) {
      return res.status(400).send({ message: 'URL is not a valid image url' });
    }

    const filteredpath = await filterImageFromURL(image_url.toString());
    res
      .status(200)
      .sendFile(filteredpath, async () => {
        deleteLocalFiles([filteredpath]);
      });
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();