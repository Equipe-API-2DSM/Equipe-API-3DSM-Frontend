import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../services/axios"
import InputPaginacao from "../components/InputPaginacao"
import Button from "../components/Button.jsx"
import CardProjeto from "../components/CardProjeto.jsx"
import { RiFilter2Fill } from "react-icons/ri";

import { BsPlusCircle } from "react-icons/bs"

function ListaProjeto() {
  const [projetos, setProjetos] = useState([])
  const navigate = useNavigate()
  const [totalPagina, setTotalPagina] = useState()
  const [pagina, setPagina] = useState(0)
  const [nomeFiltro, setNomeFiltro] = useState()
  const [chefeFiltro, setChefeFiltro] = useState()
  const [render, setRender] = useState(0)

  useEffect(() => {
    getProjetos()
  }, []) //array vazio indica que este useEffect será executado uma vez quando o componente for montado

  useEffect(() => {
    console.log("renderizou")
  }, [render])

  async function mudaInputPagina(valor) {
    console.log(valor)
    await mudaPagina(valor - 1)
  }

  function montaRequisicaoFiltragem() {
    let requisicao = ""
    if (nomeFiltro != null && nomeFiltro !== "") {
      requisicao = requisicao + "&nome=" + nomeFiltro
    }
    if (chefeFiltro != null && chefeFiltro !== "") {
      requisicao = requisicao + "&chefe=" + chefeFiltro
    }

    return requisicao
  }

  async function mudaPagina(paginaMudada) {
    console.log("Pagina Mudada: " + paginaMudada)
    let requisicao = montaRequisicaoFiltragem()
    setPagina(paginaMudada)
    requisicao = requisicao + `&page=${paginaMudada}&size=10`
    console.log("Requisição: " + requisicao)
    try {
      await axios.get(`/projeto/lista/paginada?${requisicao}`).then((response) => {
        console.log(response)
        const data = response.data.content
        setProjetos(data)
      })
    } catch (erro) { }
    setRender(render + 1)
  }

  async function getProdutoFiltro(evento) {
    evento.preventDefault()
    let requisicao = montaRequisicaoFiltragem()
    requisicao = requisicao + `&page=0&size=10`
    console.log("Requisição: " + requisicao)
    try {
      await axios.get(`/projeto/lista/paginada?${requisicao}`).then((response) => {
        const data = response.data.content
        setProjetos(data)
        const total = response.data.totalPages
        setTotalPagina(total)
        console.log(response)
      })
    } catch (erro) { }

  }

  async function getProjetos() {
    try {
      await axios.get("/projeto/lista/paginada?page=0&size=10").then((response) => {
        console.log(response)
        const data = response.data.content
        setProjetos(data)
        const total = response.data.totalPages
        setTotalPagina(total)
      })
    } catch (erro) { }
  }

  return (
    <div>
      <div className="m-5 rounded-md bg-bg100 p-7 drop-shadow-md">
        <Button
          texto="Novo"
          tipo="button"
          iconeOpcional={BsPlusCircle}
          iconeTamanho="20px"
          className="mb-5 flex items-center  gap-0.5 rounded-[10px] bg-primary50 p-2 text-lg font-semibold text-on-primary"
          onClick={() => navigate("/projetos/novo-projeto")}
        />
        <form
          className="mx-72 mt-8 absolute inset-x-0 top-0 mb-0 gap-0.5 h-16" onSubmit={(e) => { getProdutoFiltro(e) }}
        >
          <input className="w-64 my-px rounded-md border border-n70 p-1 ml-3" placeholder="Nome do Projeto:" type="text" value={nomeFiltro} onChange={(e) => { setNomeFiltro(e.target.value) }} />
          <input className="ml-1 w-64 rounded-md border border-n70 p-1 ml-4" type="text" placeholder="Líder do Projeto:" value={chefeFiltro} onChange={(e) => { setChefeFiltro(e.target.value) }} />

          <button className="w-24 border inline-flex border-n70 rounded-md p-1 ml-2" type="submit"><RiFilter2Fill className="ml-3" />Filtrar</button>
        </form>
        <hr className="border-n90"></hr>
        <div className="mx-10 flex flex-row flex-wrap gap-10">
          {projetos.map((projeto, index) => (
            <CardProjeto
              key={projeto.id_projeto}
              titulo={projeto.nome_projeto}
              descricao={projeto.descricao_projeto}
              estadoProjeto={projeto.data_inicio_projeto}
              liderProjeto={projeto.chefe_projeto}
              onClick={() => navigate(`/projetos/${projeto.id_projeto}`)}
            />
          ))}
        </div>
        <div className="ml-auto mt-12">
          {pagina != 0 ?
            <button className="mr-4" onClick={(e) => { mudaPagina(pagina - 1) }}>Anterior</button>
            :
            <button className="mr-4" onClick={(e) => { mudaPagina(pagina - 1) }} disabled>Anterior</button>
          }

          <InputPaginacao min={1} max={totalPagina} paginaAtual={pagina + 1} onValueChange={(valor) => {
            mudaInputPagina(valor)
          }} />
          <span>/{totalPagina}</span>

          {pagina < totalPagina - 1 ?
            <button className="ml-4" onClick={(e) => { mudaPagina(pagina + 1) }}>Proxima</button>
            :
            <button className="ml-4" onClick={(e) => { mudaPagina(pagina + 1) }} disabled>Proxima</button>
          }

        </div>
      </div>
    </div>
  )
}

export default ListaProjeto
