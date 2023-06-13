import { useState, createContext } from "react";

export const CreateTelegramContext = createContext()

const TelegramContext = (props) => {
    const [telegramContent, setTelegramContent] = useState([])
    const [telegramSelected, setTelegramSelected] = useState()
    const [findTelegram, setFindTelegram] = useState([])
    const [singleTelegram, setSingleTelegram] = useState({})

    return (
        <CreateTelegramContext.Provider
            value={{
                telegramContent, setTelegramContent,
                telegramSelected, setTelegramSelected,
                findTelegram, setFindTelegram,
                singleTelegram, setSingleTelegram
            }}
        >
            {props.children}
        </CreateTelegramContext.Provider>
    )
}

export default TelegramContext