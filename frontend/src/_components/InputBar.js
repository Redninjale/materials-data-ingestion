import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import Table from 'react-bootstrap/esm/Table';
import { Container, Row, Col, Stack, Button, Form, Nav, Card } from 'react-bootstrap';
import { PlusCircle, Gear, Settings, Send, Person, ChatDots } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContentForm = () => {
    const [LLMInput, setLLMInput] = useState();
    const [LLMChat, setLLMChat] = useState([{
        "prompt": "dwada",
        "information": "this is an example graph",
        "data_type": "graph",
        "graph": {
            "chartType": "LineChart",
            "data": [
                ["x", "value"],
                ['January', 10],
                ['February', 23],
                ['March', 17],
                ['April', 18],
                ['May', 9],
                ['June', 11],
                ['July', 27],
                ['August', 33],
                ['September', 40],
                ['October', '32']
            ],
            "options": {
                title: 'Line Graph Example',
                hAxis: { title: 'X Axis' },
                vAxis: { title: 'Value' },
                legend: 'none'
            }
        }
    },
    {
        "data_type": "table",
        "table": {
            "headers": ["Name", "Age", "Country"],
            "rows": [
                ["John Doe", 28, "USA"],
                ["Jane Smith", 34, "Canada"],
                ["Sam Brown", 22, "UK"]
            ]
        }
    },
    {
        "data_type": "graph",
        "graph": {
            "chartType": "ScatterChart",
            "data": [
                ["x", "value"],
                ['1', '10'],
                ['2', '23'],
                ['3', '17'],
                ['4', '18'],
                ['5', '9'],
                ['6', '11'],
                ['7', '27'],
                ['8', '33'],
                ['9', '40'],
                ['10', '32']
            ],
            "options": {
                title: 'Line Graph Example',
                hAxis: { title: 'X Axis' },
                vAxis: { title: 'Value' },
                legend: 'none'
            }
        }
    }
    ]);
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
            console.log(JSON.parse(resp.data));
            // setLLMOutput(resp.data);
            setLLMChat([...LLMChat, JSON.parse(resp.data)]);
        }).catch(error => {
            console.log("Failed to send to LLM", error);
        })
    }

    const onSubmit = (data) => {
        getOutput(data);
    };

    const handleSendClick = () => {
        const inputElement = document.querySelector('input[name="llm_input"]');
        if (inputElement) {
            const inputValue = inputElement.value;
            if (inputValue.trim() !== "") {
                onSubmit({ llm_input: inputValue });
                inputElement.value = "";
            }
        }
    };

    return (
        <div className='align-content-center justify-content-center' style={{ width: '80vw'}}>
            <div className='align-content-center justify-content-center' style={{ overflowY: 'scroll',  maxHeight:"80vh"}}>
                <Stack direction="vertical" className='p-4 w-50 mx-auto' gap={4}>
                    {
                        LLMChat.map((output, index) => {
                            return (
                                <Stack key={index} className=' font-weight-bold'>
                                    <span style={{ textAlign: "left", color: "#000FFF"}}>
                                        user prompt: {output.prompt}
                                    </span>
                                    <p style={{ textAlign: "left"}}>
                                        {output.information}
                                    </p>
                                    <Card className='p-2'>
                                        {output['data_type'] === "graph" ? (
                                            <>
                                                <Chart
                                                    chartType={output.graph.chartType}
                                                    width="100%"
                                                    height="400px"
                                                    data={output.graph.data.map((row) => {
                                                        const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string);
                                                        row.map((value, i) => {
                                                            if (isNumeric(value)) {
                                                                row[i] = parseFloat(value);
                                                            }
                                                        });
                                                        return row;
                                                    })}
                                                    options={output.graph.options}
                                                    chartWrapperParams={{ chartType: output.graph.chartType, dataTable: output.graph.data, options: output.graph.options }}
                                                    getChartWrapper={(chartWrapper) => {
                                                        window.chartWrapper = chartWrapper;
                                                    }}
                                                />
                                                <Button onClick={() => {
                                                    const chart = window.chartWrapper.getChart();
                                                    const imgUri = chart.getImageURI();
                                                    saveAs(imgUri, 'chart.png');
                                                }}>Download Chart</Button>
                                            </>
                                        ) : output['data_type'] === "table" ? (
                                            <>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            {output.table.headers.map((header, headerIndex) => (
                                                                <th key={headerIndex}>{header}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {output.table.rows.map((row, rowIndex) => (
                                                            <tr key={rowIndex}>
                                                                {row.map((cell, cellIndex) => (
                                                                    <td key={cellIndex}>{cell}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                <Button onClick={() => {
                                                    const csvContent = [
                                                        output.table.headers.join(","),
                                                        ...output.table.rows.map(row => row.join(","))
                                                    ].join("\n");

                                                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                                    saveAs(blob, 'table.csv');
                                                }}>Download Table</Button>
                                            </>
                                        ) : (
                                            <>
                                                <h1>{output.text.title}</h1>
                                                <p>{output.text.body}</p>
                                            </>
                                        )}
                                </Card>
                            </Stack>);
                        })
                        }
                </Stack>
            </div>
            <div className='mx-auto p-3 border-top w-75 d-flex'>
                <Form.Control
                    type="text"
                    placeholder="Type your message here..."
                    className="me-2"
                    name="llm_input"
                />
                <Button variant="primary" type="submit" onClick={handleSendClick}>
                    <Send />
                    <span className="visually-hidden">Send</span>
                </Button>
            </div>
        </div>
    );
}

export default ContentForm;