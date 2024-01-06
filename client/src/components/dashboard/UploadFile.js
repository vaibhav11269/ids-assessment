import { useState, useEffect, useContext } from "react";
import Papa from "papaparse";
import axios from 'axios';
import { config } from "../../config/config";
import { enqueueSnackbar } from "notistack";
import { Table } from "react-bootstrap";
import UserContext from "../../context/UserContext";

let headings = ['Name', 'Email', 'Gender', 'Country', 'Device'];

export default function UploadCsv() {
    const { user } = useContext(UserContext);
    const [parsedData, setParsedData] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [values, setValues] = useState([]);
    const [name, setName] = useState('');
    const [file, setFile] = useState();
    const [uploaded, setUploaded] = useState(false)

    const changeHandler = (event) => {
        console.log("file", event.target.files[0].filename)
        setName(event.target.files[0].filename);
        setFile(event.target.files[0]);
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const rowsArray = [];
                const valuesArray = [];
                results.data.map((d) => {
                    rowsArray.push(Object.keys(d));
                    valuesArray.push(Object.values(d));
                });
                setParsedData(results.data);
                setTableRows(rowsArray[0]);
                setValues(valuesArray);
                console.log("res", results.data, rowsArray[0], valuesArray)
            },
        });
    };
    const removeAll = () => {
        setParsedData([]);
        setTableRows([]);
        setValues([]);
        setName('');
        setFile();
        setUploaded(false);
    }
    const validateData = () => {
        const allUsersValid = parsedData.every(isValidUser);
        return allUsersValid;
    }
    const isValidUser = (user) => {
        return user && user.Name && user.Email && user.Gender;
    };
    const uploadData = () => {
        if (validateData()) {
            let headers = {
                'Accept': 'application/json',
                "Authorization": "Bearer " + user.token,
                'Content-Type': 'multipart/form-data',
            }
            const formData = new FormData();
            formData.append("file", file);
            console.log(formData)
            axios.post(config.apiEndpoint + "users/uploadData", formData, { headers: headers })
                .then(function (response) {
                    console.log("success", response.data);
                    let newValues = response.data.results.map((result, i) => {
                        let cur = [...values[i], result.message];
                        return cur;
                    });
                    setValues(newValues);
                    setUploaded(true);
                    enqueueSnackbar(response?.data?.message, { variant: "success" });
                }).catch(function (error) {
                    console.log("error", error);
                    setUploaded(false);
                    enqueueSnackbar("Something Went Wrong", { variant: "error" });
                });
        } else {
            enqueueSnackbar("Please add correct file", { variant: "error" });
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between w-full">
                <input
                    type="file"
                    value={name}
                    name="file"
                    onChange={changeHandler}
                    accept=".csv"
                />
                <button className="bg-gray-400 py-2 px-4 text-balck font-semibold uppercase rounded text-sm" onClick={removeAll}>Clear</button>
            </div>
            {file ?
                <div className="mt-3 overflow-y-auto h-[66vh] w-full">
                    <Table striped bordered hover>
                        <thead className="bg-custom-bg-color hover:custom-bg-color text-custom-text-color font-semibold">
                            <tr className="whitespace-nowrap">
                                {tableRows.map((rows, index) => {
                                    return <th key={index}>{rows}</th>;
                                })}
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {values.map((value, index) => {
                                return (
                                    <tr key={index}> {
                                        value.map((val, i) => {
                                            return <td key={i}>{val}</td>;
                                        })}
                                        {!uploaded && <td></td>}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div> : <></>}
            {name === '' ? <div></div>
                : <div className="flex justify-end items-center absolute bottom-4 right-4">
                    <button className={`p-2 px-4 text-black font-semibold uppercase rounded text-xs whitespace-nowrap ${uploaded ? "bg-gray-700" : "bg-gray-400"}`}
                        onClick={uploadData}
                        disabled={uploaded}> UPLOAD </button>
                </div>
            }
        </div>
    );
}