import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import Button from "../Button"
import axios from "../../services/axios"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom"
import schemaAtualizarUsuario from "./validation"
import InputMask from "react-input-mask";

import { BsPlayFill } from "react-icons/bs"

function AlterarUsuario() {
    const [usuario, setUsuario] = useState([])
    const navigate = useNavigate()
    const { idUsuario } = useParams()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schemaAtualizarUsuario),
        defaultValues: {
            nomeUsuario: usuario.nome,
        },
    })

    function updateFieldsWithDefaults(fieldsDefaults, data) {
        for (const field in fieldsDefaults) {
            if (!data[field] && fieldsDefaults[field] !== null) {
                data[field] = fieldsDefaults[field];
            }
        }
    }

    const gerarJsonUsuario = (data) => {
        const usuario = {
            id_usuario: data.idUsuario,
            nome: data.nomeUsuario,
            email: data.emailUsuario,
            senha: data.senhaUsuario,
            telefone: data.telefoneUsuario,
            cargo: data.cargoUsuario
        }

        return usuario
    }

    async function getUsuario() {
        try {
            await axios.get(`/usuario/listar/${idUsuario}`).then((response) => {
                const data = response.data
                setUsuario(data)

                setValue("nomeUsuario", data.nome);
                setValue("emailUsuario", data.email);
                setValue("senhaUsuario", data.senha);
                setValue("confirmarSenhaUsuario", data.senha);
                if (data && data.telefone) {
                    setValue("telefoneUsuario", data.telefone);
                }
                setValue("cargoUsuario", data.cargo);
            })
        } catch (erro) {
            console.log('aaaaa')
        }
    }

    const alterarUsuario = async (data) => {
        const userDefaults = {
            nomeUsuario: usuario.nome,
            emailUsuario: usuario.email,
            senhaUsuario: usuario.senha,
            telefoneUsuario: usuario.telefone,
            idUsuario: usuario.id_usuario
        };

        updateFieldsWithDefaults(userDefaults, data);

        console.log(data)
        const usuarioJson = gerarJsonUsuario(data)

        await axios.put(`/usuario/atualizar`, usuarioJson).then((response) => {
            if (response.status === 200) {
                Swal.fire({
                    title: "Dados atualizados com sucesso!",
                    icon: "success",
                    confirmButtonColor: "#132431",
                    allowOutsideClick: false,
                    allowEscapeKey: false

                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/usuario")
                    }
                })
            }
            else {
                Swal.fire('Erro ao realizar a alteração do usuário :(', '', 'error');
            }
        })
    }

    const handleExcluirUsuarioClick = async () => {
        const confirmacao = await Swal.fire({
            icon: "warning",
            title: "Cuidado!",
            text: "Tem certeza que deseja excluir esse usuário?",
            showDenyButton: true,
            confirmButtonText: "Sim",
            denyButtonText: `Não`,
        })

        if (confirmacao.isConfirmed) {
            console.log(idUsuario)
            try {
                await axios.delete(`/usuario/deletar/${idUsuario}`)
                Swal.fire("Excluído com sucesso!", "", "success")
                navigate("/usuario")
            } catch (error) {
                console.error("Erro ao excluir o usuário:", error)
            }
        }
    }

    useEffect(() => {
        getUsuario()
    }, [])

    return (
        <div>
            <div className="bg-bg100 m-5 rounded-md p-7 drop-shadow-md">
                <Button
                    tipo="submit"
                    texto="Excluir usuário"
                    iconeOpcional={BsPlayFill}
                    iconeTamanho="20px"
                    onClick={handleExcluirUsuarioClick}
                    className="mr-5 mb-3 flex h-2/6 items-center gap-1 rounded-[10px] bg-primary51 p-2 text-lg font-semibold text-on-primary"
                />
                <hr className="border-n90" />
                <form onSubmit={handleSubmit(alterarUsuario)}>
                    <input type="hidden" id="idUsuario" defaultValue={usuario.id_usuario} />
                    <div className="mt-4 flex flex-col">
                        <h1 className="font-semibold text-2xl text-center">Alteração de Dados Usuario</h1>
                    </div>
                    <div className="mt-5 flex flex-col">
                        <label
                            htmlFor="nomeUsuario"
                            className="text-base font-medium text-on-light"
                        >
                            Nome Completo:
                        </label>
                        <input
                            type="text"
                            className="w-1/2 rounded-md border border-n70 p-1"
                            id="nomeUsuario"
                            {...register(`nomeUsuario`)}
                        />
                        {errors.nomeUsuario && (
                            <label
                                htmlFor="nomeUsuario"
                                className="text-sm font-light text-error"
                            >
                                {errors.nomeUsuario.message}
                            </label>
                        )}
                    </div>
                    <div className="mt-4 flex flex-col">
                        <label
                            htmlFor="emailUsuario"
                            className="text-base font-medium text-on-light"
                        >
                            Email:
                        </label>
                        <input
                            type="text"
                            className="w-1/2 rounded-md border border-n70 p-1"
                            {...register("emailUsuario")}
                        />
                        {errors.emailUsuario && (
                            <label
                                htmlFor="emailUsuario"
                                className="text-sm font-light text-error"
                            >
                                {errors.emailUsuario.message}
                            </label>
                        )}
                    </div>
                    <div className="mt-4 flex flex-col">
                        <label
                            htmlFor="senhaUsuario"
                            className="text-base font-medium text-on-light"
                        >
                            Senha:
                        </label>
                        <input
                            type="password"
                            className="w-1/2 rounded-md border border-n70 p-1"
                            {...register("senhaUsuario")}
                        />
                        {errors.senhaUsuario && (
                            <label
                                htmlFor="senhaUsuario"
                                className="text-sm font-light text-error"
                            >
                                {errors.senhaUsuario.message}
                            </label>
                        )}
                    </div>
                    <div className="mt-4 flex flex-col">
                        <label
                            htmlFor="confirmarSenhaUsuario"
                            className="text-base font-medium text-on-light">
                            Confirme a Senha:
                        </label>
                        <input
                            type="password"
                            className="w-1/2 rounded-md border border-n70 p-1"
                            {...register("confirmarSenhaUsuario")}
                        />
                        {errors.confirmarSenhaUsuario && (
                            <label
                                htmlFor="confirmarSenhaUsuario"
                                className="text-sm font-light text-error"
                            >
                                {errors.confirmarSenhaUsuario.message}
                            </label>
                        )}
                    </div>
                    <div className="mt-4 flex flex-col">
                        <label
                            htmlFor="telefoneUsuario"
                            className="text-base font-medium text-on-light"
                        >
                            Telefone:
                        </label>
                        <InputMask
                            mask="(99) 99999-9999"
                            maskChar="_"
                            className="w-1/2 rounded-md border border-n70 p-1"
                            {...register("telefoneUsuario")}
                        />
                        {errors.telefoneUsuario && (
                            <label
                                htmlFor="telefoneUsuario"
                                className="text-sm font-light text-error"
                            >
                                {errors.telefoneUsuario.message}
                            </label>
                        )}
                    </div>
                    <div className="mt-4 flex flex-col">
                        <label
                            htmlFor="cargoUsuario"
                            className="text-base font-medium text-on-light"
                        >
                            Cargo:
                        </label>
                        <select className="w-1/2 border rounded border-n70 p-1" {...register("cargoUsuario")}>
                            <option className="bg-primary98" value="EngenheiroChefe">Engenheiro Chefe</option>
                            <option value="LiderProjeto">Líder de Projeto</option>
                        </select>
                    </div>

                    <div className="mt-5 flex justify-end">
                        <Button
                            texto="Salvar"
                            tipo="submit"
                            className="rounded-[10px] bg-primary50 p-2 text-lg font-semibold text-on-primary mt-10"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AlterarUsuario