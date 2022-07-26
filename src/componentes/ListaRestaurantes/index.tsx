import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';

interface IParametrosBusca {
  ordering?: string;
  search?: string;
}

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('');

  /* ----Solução para concatenar as páginas de restaurante
  useEffect(() => {
    //obter restaurantes
    axios
      .get<IPaginacao<IRestaurante>>(
        'http://localhost:8000/api/v1/restaurantes/'
      )
      .then((resposta) => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }, []);

  const verMais = () => {
    axios
      .get<IPaginacao<IRestaurante>>(proximaPagina)
      .then((resposta) => {
        setRestaurantes([...restaurantes, ...resposta.data.results]);
        setProximaPagina(resposta.data.next);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };
  */

  // ----Solução com botão de próxima página e anterior
  // agora, o carregarDados recebe opcionalmente as opções de configuração do axios
  const carregaDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios
      .get<IPaginacao<IRestaurante>>(url, opcoes)
      .then((resposta) => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  // a cada busca, montamos um objeto de opções
  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const opcoes = {
      params: {} as IParametrosBusca,
    };
    if (busca) {
      opcoes.params.search = busca;
    }
    if (ordenacao) {
      opcoes.params.ordering = ordenacao;
    }
    carregaDados('http://localhost:8000/api/v1/restaurantes/', opcoes);
  };

  useEffect(() => {
    // obter restaurantes
    carregaDados('http://localhost:8000/api/v1/restaurantes/');
  }, []);

  return (
    <section className={style.ListaRestaurantes}>
      <Typography sx={{ textAlign: 'center' }} component='h2' variant='h4'>
        Os restaurantes mais{' '}
        <strong>
          <em>bacanas</em>!
        </strong>
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexGrow: 1,
          width: '50%',
        }}
      >
        {/* sinta-se livre para deixar o formulário mais elegante, aplicando estilos CSS */}
        <Box component='form' sx={{ width: '100%' }} onSubmit={buscar}>
          <TextField
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            id='standard-basic'
            label='Busque o restaurante'
            variant='standard'
            fullWidth
            margin='dense'
          />
          <FormControl margin='dense' fullWidth>
            <InputLabel id='select-ordenacao'>Ordenação</InputLabel>
            <Select
              labelId='select-ordenacao'
              value={ordenacao}
              onChange={(evento) => setOrdenacao(evento.target.value)}
            >
              <MenuItem value=''>Padrão</MenuItem>
              <MenuItem value='id'>Por ID</MenuItem>
              <MenuItem value='nome'>Por Nome</MenuItem>
            </Select>
          </FormControl>
          <Button type='submit'>buscar</Button>
        </Box>
      </Box>
      {/* </form> */}
      {restaurantes?.map((item) => (
        <Restaurante restaurante={item} key={item.id} />
      ))}
      {/* ----Solução para concatenar as páginas de restaurante 
      {proximaPagina && <button onClick={verMais}>ver mais</button>}
       */}
      {
        <Button
          onClick={() => carregaDados(paginaAnterior)}
          disabled={!paginaAnterior}
        >
          Página anterior
        </Button>
      }
      {
        <Button
          onClick={() => carregaDados(proximaPagina)}
          disabled={!proximaPagina}
        >
          Próxima página
        </Button>
      }
    </section>
  );
};

export default ListaRestaurantes;
