import {useEffect, useState} from "react";
import { set, useForm } from 'react-hook-form';
import axios from "axios";

const InputBar = () => {
    const [LLMInput, setLLMInput] = useState();
    const { register, handleSubmit } = useForm();

    function getLLM(data) {
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
            <form onSubmit={handleSubmit(getLLM)} >
                <div>
                    <label>Enter your message:</label>
                    <input {...register("llm_input")} type="text" />
                </div>
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
}

export default InputBar;