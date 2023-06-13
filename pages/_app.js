import Navbar from "@/components/generic/navbar";
import FacebookContext from "@/context/facebook/facebook-context";
import TiktokContext from "@/context/tiktok/tiktok-context";
import CMSContext from "@/context/cms/cms-context";
import TelegramContext from "@/context/telegram/telegram-context";
import { SessionProvider } from "next-auth/react"
import { getSession } from "next-auth/react";

import "@/styles/globals.css";
import Footer from "@/components/generic/footer";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
	return <>
		<FacebookContext>
			<TiktokContext>
				<CMSContext>
					<TelegramContext>
						<SessionProvider session={session}>
							
								<Navbar />
								<Component {...pageProps} />
								<Footer />
							
						</SessionProvider>
					</TelegramContext>
				</CMSContext>
			</TiktokContext>
		</FacebookContext>
	</>;
}

export async function getServerSideProps({ req }){
	const session = await getSession({ req })

	if(!session){
		return {
		redirect : {
			destination: '/auth/login',
			permanent: false
		}
		}
	}

	return {
		props: { session }
	}
}
