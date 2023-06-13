import { serialize } from 'cookie'; // Import the 'serialize' function from the 'cookie' library
import axios from 'axios';

const client_key = "aw47ylakfnsf39dq";

export default async function Authenticate(req, res) {
    try {
        const csrfState = Math.random().toString(36).substring(2);
        
        const cookieOptions = {
            maxAge: 60000,
            path: '/', // Specify the path where the cookie is valid
        };
        const csrfStateCookie = serialize('csrfState', csrfState, cookieOptions);
        
        res.setHeader('Set-Cookie', csrfStateCookie);
        
        let url = 'https://www.tiktok.com/auth/authorize/';

        url+= `?client_key=${client_key}`
        url+= `&scope=user.info.basic,video.list`
        url += '&response_type=code';
        url += `&redirect_uri=admin88-cms.vercel.app`;
        url += '&state=' + csrfState;

        res.json({})
        
    } catch (error) {
        console.log(error)
        res.json({ message: "error" })
    }
}
