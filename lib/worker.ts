import { Worker } from 'bullmq';
import { QdrantVectorStore } from '@langchain/qdrant';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { client } from './vectorDb';
import { embedder } from './ai';
import prisma from './prisma/prisma';
import * as fs from 'fs';
import path from 'path';

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    try{
      const data = JSON.parse(job.data);
    
      const loader = new PDFLoader(data.path);
      const docs = await loader.load();
      
      const docsWithMetadata = docs.map(doc => ({
        ...doc,
        metadata: {
          userId: data.userId,
          doc_id: data.filename
        }
      }));
      
      const vectorStore = await QdrantVectorStore.fromDocuments(
        docsWithMetadata,
        embedder,
        {
          client,
          collectionName: data.filename
        }
      );
      
      const collection = await client.getCollection(data.filename);
      
      if (collection.points_count && collection.points_count > 0) {

        const filePath = path.join(__dirname, ".." , 'uploads', data.filename);


        fs.unlinkSync(filePath)
              
      } else {
        
        return { message : "Collection Cant be found" }
      }
    }
    catch(e){
      console.log(e)
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379
    }
  }
);

worker.on("completed" , () => {
  return "JOB has been completed"
})