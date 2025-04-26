import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import PendaftaranRoute from "./routes/PendaftaranRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import LombaRoute from "./routes/LombaRoute.js";
import DashboardRoute from "./routes/DashboardRoute.js";
import BannerRoute from "./routes/BannerRoute.js";
import DokumentasiRoute from "./routes/DokumentasiRoute.js";
import TentangKegiatanRoute from "./routes/TentangKegiatanRoute.js";
// import multer from "multer";
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.get('/', (req, res) => {
    res.send('Backend Berjalan!');
  });
  
  app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
  });
  
  export default app; 



// (async()=> {
//     await db.sync();
// }) ();



app.use(cors({
    credentials: true,
    origin: 3000
}));


app.use(express.json());
app.use(bodyParser.json());
app.use(UserRoute);
app.use(PendaftaranRoute);
app.use(AuthRoute);
app.use(CategoryRoute);
app.use(LombaRoute);
app.use(DashboardRoute);
app.use(BannerRoute);
app.use(DokumentasiRoute);
app.use(TentangKegiatanRoute);
// store.sync();

app.use(bodyParser.urlencoded({ extended: true }));


// app.listen(5000, ()=> {
//     console.log('Server up and running...');
// });
