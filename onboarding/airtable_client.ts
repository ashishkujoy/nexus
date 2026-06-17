import { neon } from '@neondatabase/serverless';
import Airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base.js";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
const sql = neon(process.env.DATABASE_URL!);
import {config} from "dotenv"

config();

cloudinary.config({ 
  cloud_name: process.env.CLAUDINARY_CLOUD_NAME, 
  api_key: process.env.CLAUDINARY_API_KEY, 
  api_secret: process.env.CLAUDINARY_API_SECRET
}); 


export class AirtableClient {
  private base: AirtableBase;
  private viewName: string;
  private tableId: string;

  constructor(
    apiKey: string,
    baseId: string,
    viewName: string,
    tableId: string,
  ) {
    this.base = new Airtable({ apiKey }).base(baseId);
    this.viewName = viewName;
    this.tableId = tableId;
  }

  async onboardInterns(batchId: number) {
    const table = this.base(this.tableId);

    const record = await table.select({ view: this.viewName }).all();
    const interns = record.map(this.#toIntern);
    const internsWithImg = await Promise.all(
      interns.map(intern => this.#onboard(intern, batchId))

    );
    return internsWithImg;
  }

  async #onboard(intern: any, batchId: number) {
    console.log(intern);
    try {
      const r = await sql`
        INSERT INTO interns (name, email, batch_id, img_url)
        VALUES (${intern.name}, ${intern.email}, ${batchId}, '')
        RETURNING id;
      `;
      const dbId = r[0].id;
      if (intern.imgUrl) {
        const savedUrl = await saveImage(intern.imgUrl, intern.id);
        await sql`UPDATE interns SET img_url = ${savedUrl} WHERE id = ${dbId};`;
        intern.imgUrl = savedUrl;
      }
      return intern;
    } catch(e) {
      console.error(e);
    }
  }

  #toIntern(record: any) {
    const fields = record.fields;
    return {
      id: record.id,
      name: formatName(fields["Name"]),
      email: fields["Email ID"],
      imgUrl: getImgUrl(fields),
    };
  }
}

const fetchAndResize = async (url: string): Promise<Buffer> => {
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  return sharp(buffer)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
};

const saveImage = async (url: string, id: string) => {
  const resized = await fetchAndResize(url);
  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        public_id: `${id}`,
        access_mode: "authenticated",
        type: "authenticated",
        folder: "agrasandhan",
        fetch_format: "auto",
        quality: "auto",
        overwrite: true,
      },
      (error, result) => error ? reject(error) : resolve(result)
    ).end(resized);
  });

  return uploadResult.secure_url;
};

const getImgUrl = (fields: any) => {
  if (!fields["Photograph"]) return;
  const photographField = fields["Photograph"].at(-1) || {};
  return photographField.url;
};

const formatName = (name: string) => {
  return name.replaceAll(".", " ")
    .split(" ")
    .filter((name) => name.trim() !== "")
    .map((namePart) =>
      namePart[0].toUpperCase() + namePart.slice(1).toLowerCase()
    )
    .join(" ");
};

const main = async () => {
  const baseId = process.argv[2];
  const tableId = process.argv[3];
  const viewName = process.argv[4];
  const batchId = Number(process.argv[5]);

  const airtableClient = new AirtableClient(
    process.env.AirtableApiKey as string,
    baseId,
    viewName,
    tableId,
  );

  const interns = await airtableClient.onboardInterns(batchId);
  console.log(interns);
};

main();
