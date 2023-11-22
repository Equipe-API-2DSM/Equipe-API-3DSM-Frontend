/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import Button from "./Button"

import Swal from "sweetalert2"
import axios from "../services/axios"
import CriarExcel from "./CriarExcel"

import { BsPlayFill } from "react-icons/bs"

function VisaoGeral({
  nomeProjeto,
  descricaoProjeto,
  liderProjeto,
  progressoProjeto,
  DataProjetoIniciado,
  camposValidados,
  setAtualizar,
}) {
  const [projetoNaoIniciado, setProjetoNaoIniciado] = useState(
    !DataProjetoIniciado,
  )
  const { tabela, horaValorProjeto, projeto } = camposValidados
  const MaterialoNiveis = tabela.map((linha) => linha.materiais)
  const hora_homemNiveis = tabela.map((linha) => linha.hora_homem)
  let tarefasComCamposVazios = false

  for (const chaveProjeto in projeto.sub_projetos) {
    if (projeto.sub_projetos.hasOwnProperty(chaveProjeto)) {
      const subprojeto = projeto.sub_projetos[chaveProjeto]

      if (subprojeto.nivel_sub_projeto.length !== 0) {
        // Se o subprojeto tem níveis (nivelSubProjeto)
        const niveisSubProjeto = subprojeto.nivel_sub_projeto

        // Iterar sobre os níveis
        for (const chaveNivel in niveisSubProjeto) {
          if (niveisSubProjeto.hasOwnProperty(chaveNivel)) {
            const nivelSubProjeto = niveisSubProjeto[chaveNivel]

            // Verificar se o nível (nivelSubProjeto) tem tarefas
            if (
              nivelSubProjeto.tarefas &&
              Object.keys(nivelSubProjeto.tarefas).length === 0
            ) {
              tarefasComCamposVazios = true
            }

            // Iterar sobre as tarefas do nível
            for (const chaveTarefa in nivelSubProjeto.tarefas) {
              if (nivelSubProjeto.tarefas.hasOwnProperty(chaveTarefa)) {
                const tarefa = nivelSubProjeto.tarefas[chaveTarefa]

                // Verificar se algum dos campos da tarefa está vazio
                if (
                  !tarefa.descricao_atividade_tarefa ||
                  !tarefa.peso_tarefa ||
                  !tarefa.resultado_esperado_tarefa
                ) {
                  tarefasComCamposVazios = true
                  break // Sai do loop se encontrar uma tarefa com campos vazios
                }
              }
            }

            if (tarefasComCamposVazios) {
              break // Sai do loop se encontrar tarefas com campos vazios no nível
            }
          }
        }
      } else {
        if (
          subprojeto.tarefas &&
          Object.keys(subprojeto.tarefas).length === 0
        ) {
          tarefasComCamposVazios = true
          break
        } else {
          for (const chaveTarefa in subprojeto.tarefas) {
            if (subprojeto.tarefas.hasOwnProperty(chaveTarefa)) {
              const tarefa = subprojeto.tarefas[chaveTarefa]

              // Verificar se algum dos campos está vazio
              if (
                !tarefa.descricao_atividade_tarefa ||
                !tarefa.peso_tarefa ||
                !tarefa.resultado_esperado_tarefa
              ) {
                tarefasComCamposVazios = true
                break // Sai do loop se encontrar uma tarefa com campos vazios
              }
            }
          }
        }
      }

      if (tarefasComCamposVazios) {
        break // Sai do loop de projetos se encontrar tarefas com campos vazios no subprojeto
      }
    }
  }

  // pegando o mes-ano atual
  const dataAtual = new Date()
  const ano = dataAtual.getFullYear()
  const mes = String(dataAtual.getMonth() + 1).padStart(2, "0")
  const dataInicio = `${mes}-${ano}`

  const { id } = useParams()
  const navigate = useNavigate()

  const possuiNíveisSubNiveis = (tabela) => {
    return tabela.some((item) => item.nivel !== "1")
  }

  const handleIniciarProjetoClick = async () => {
    const data = { data_inicio_projeto: dataInicio }
    const algumMaterialZero = MaterialoNiveis.some(
      (valor) => valor === 0 || valor === null,
    )
    const algumaHoraHomemZero = hora_homemNiveis.some(
      (valor) => valor === 0 || valor === null,
    )

    // Validações
    if (!possuiNíveisSubNiveis(tabela)) {
      Swal.fire("Alerta!", "Projeto não possui níveis ou subníveis!", "error")
    } else if (horaValorProjeto === 0) {
      Swal.fire("Alerta!", "Projeto não possui valor hora!", "error")
    } else if (algumMaterialZero) {
      Swal.fire("Alerta!", "Projeto não possui valores para material!", "error")
    } else if (algumaHoraHomemZero) {
      Swal.fire(
        "Alerta!",
        "Projeto não possui valores para hora homem!",
        "error",
      )
    } else if (tarefasComCamposVazios) {
      Swal.fire(
        "Alerta!",
        "Existem tarefas com campos vazios. Não é possível iniciar o projeto.",
        "error",
      )
    } else {
      // Swal.fire('Projeto iniciado com sucesso!', '', 'sucess');
      const response = await await axios
        .post(`/projeto/${id}/iniciarprojeto`, data)
        .then((res) => {
          setProjetoNaoIniciado(false)
          setAtualizar(true)
          Swal.fire("Projeto iniciado com sucesso!", "", "sucess")
        })
        .catch((error) => {
          console.log("error", error)
        })
    }
  }

  const handleExcluirProjetoClick = async () => {
    const confirmacao = await Swal.fire({
      icon: "warning",
      title: "Cuidado!",
      text: "Tem certeza que deseja excluir esse projeto?",
      showDenyButton: true,
      confirmButtonText: "Sim",
      denyButtonText: `Não`,
    })

    if (confirmacao.isConfirmed) {
      try {
        const response = await axios.delete(`/projeto/deletar/${id}`)
        Swal.fire("Excluído com sucesso!", "", "success")
        navigate("/projetos")
      } catch (error) {
        console.error("Erro ao excluir o projeto:", error)
      }
    }
  }

  useEffect(() => {
    setProjetoNaoIniciado(!DataProjetoIniciado)
  }, [DataProjetoIniciado])

  return (
    <div className="m-5 rounded-md bg-bg100 p-4 drop-shadow-md">
      <h2 className="mb-1 text-xl font-medium text-on-light">Visão Geral</h2>
      <hr className="border-n90" />

      <div className="my-3 flex justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <h3 className="text-2xl font-medium text-complementary-20">
            {nomeProjeto}
          </h3>
          <p className="text-n20">{descricaoProjeto}</p>
        </div>
        <div className="flex flex-col gap-5">
          {projetoNaoIniciado && (
            <>
              <Button
                texto="Iniciar projeto"
                iconeOpcional={BsPlayFill}
                iconeTamanho="20px"
                className="mr-5 flex h-2/6 items-center gap-1 rounded-[10px] bg-primary50 p-2 text-lg font-semibold text-on-primary"
                onClick={handleIniciarProjetoClick}
              />
              <Button
                texto="Excluir projeto"
                iconeOpcional={BsPlayFill}
                iconeTamanho="20px"
                onClick={handleExcluirProjetoClick}
                className="mr-5 flex h-2/6 items-center gap-1 rounded-[10px] bg-primary51 p-2 text-lg font-semibold text-on-primary"
              />
            </>
          )}
          {!projetoNaoIniciado && (
            <div className="mr-96 flex items-center gap-1">
              <span className="text-2xl">
                Progresso:{" "}
                <span className="text-2xl text-complementary-20">{`${progressoProjeto}%`}</span>{" "}
              </span>
              <progress
                value={progressoProjeto}
                max={100}
                className="h-2 rounded bg-complementary-20"
              ></progress>
            </div>
          )}
        </div>
      </div>

      <span className="mt-2 inline-grid grid-cols-2 gap-2 text-n20">
        <span className="font-semibold text-complementary-20">
          Líder do projeto:
        </span>
        <span>{liderProjeto ? liderProjeto : "Não atribuído"}</span>
      </span>
      <br />
      {/* <span className="mt-2 inline-grid grid-cols-2 gap-2 text-n20">
        <span className="font-semibold text-complementary-20">
          Info Relevante:
        </span>
        <span>{}</span>
      </span>
      <br />
      <span className="mt-2 inline-grid grid-cols-2 gap-2 text-n20">
        <span className="font-semibold text-complementary-20">
          Info Relevante:
        </span>
        <span>{}</span>
      </span> */}
      <hr className="border-n90 my-4" />
      <CriarExcel projeto={projeto} idProjeto={id} />
    </div>
  )
}

VisaoGeral.propTypes = {
  nomeProjeto: PropTypes.string.isRequired,
  descricaoProjeto: PropTypes.string,
  liderProjeto: PropTypes.string,
}

export default VisaoGeral
