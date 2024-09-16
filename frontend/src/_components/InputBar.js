import {useEffect, useState} from "react";
import { set, useForm } from 'react-hook-form';
import axios from "axios";

const ContentForm = () => {
    const [LLMChat, setLLMChat] = useState([]);
    const [LLMOutput, setLLMOutput] = useState();
    const { register, handleSubmit } = useForm();

    function getOutput(data) {
        console.log(JSON.stringify(data.llm_input))
        axios.post("http://localhost:8000/api/llm", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            proxy: {
                host: 'localhost',
                port: 8000,
            },
            data: JSON.stringify(data.llm_input),
        }).then(resp => {
            if (resp.status != 200) {
                throw Error(JSON.stringify(resp));
            }
            console.log(resp.data);
            setLLMInput(resp.data);
        }).catch(error => {
            console.log("Failed to send to LLM", error);
        })
    }

    return (
        <div>
            {
                LLMChat.map(() => {
                    return (
                        <div>
                            
                        </div>
                    );
                })
            }
            <form onSubmit={handleSubmit(getOutput)} >
                <div>
                    <label>Enter your message:</label>
                    <input {...register("llm_input")} type="text" />
                </div>
                {/* <div>
                    <input type="file" accept="image/png, image/jpeg" />
                </div> */}
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
}

export default InputBar;