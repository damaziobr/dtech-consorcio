"use client";

import { useState, useEffect } from "react";

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Home() {
  const [descricao, setDescricao] = useState("");
  const [cotas, setCotas] = useState(10);
  const [valorInicial, setValorInicial] = useState(50);
  const [incremento, setIncremento] = useState(0);
  const [dataInicio, setDataInicio] = useState("");

  const [frequencia, setFrequencia] = useState("semanal");
  const [intervaloDias, setIntervaloDias] = useState(2);
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([]);

  const [resultado, setResultado] = useState("");

  function toggleDia(dia: number) {
    setDiasSelecionados((prev) =>
      prev.includes(dia)
        ? prev.filter((d) => d !== dia)
        : [...prev, dia]
    );
  }

  // 🔥 AUTO SELECIONA DIA INICIAL
  useEffect(() => {
    if (!dataInicio) return;

    const dia = new Date(dataInicio).getDay();

    if (frequencia === "dias") {
      setDiasSelecionados([dia]);
    }
  }, [dataInicio, frequencia]);

  // 🔥 GERAÇÃO DA TABELA (CORRIGIDA)
  useEffect(() => {
    if (!dataInicio) return;

    let texto = `📊 *d! Tech Soluções - Tabela de Consórcio*\n\n`;
    if (descricao) texto += `${descricao}\n\n`;

    let dataAtual = new Date(dataInicio);
    let contador = 1;
    let tentativas = 0;

    while (contador <= cotas && tentativas < 500) {
      tentativas++;

      let incluir = false;

      if (frequencia === "diario") incluir = true;

      if (frequencia === "semanal") {
        incluir =
          contador === 1 ||
          dataAtual.getDay() === new Date(dataInicio).getDay();
      }

      if (frequencia === "intervalo") {
        incluir = true;
      }

      if (frequencia === "mensal") {
        incluir =
          dataAtual.getDate() === new Date(dataInicio).getDate();
      }

      if (frequencia === "dias") {
        if (diasSelecionados.length === 0) {
          setResultado("⚠️ Selecione pelo menos um dia da semana");
          return;
        }

        incluir = diasSelecionados.includes(dataAtual.getDay());
      }

      if (incluir) {
        const valor = valorInicial + (contador - 1) * incremento;
        const total = valor * (cotas - 1);

        const dia = dataAtual.toLocaleDateString("pt-BR");
        const semana = diasSemana[dataAtual.getDay()].toUpperCase();

        texto += `${contador}-${dia} (${semana}) R$ ${valor.toFixed(
          0
        )} = ${total.toFixed(0)}\n`;

        contador++;
      }

      if (frequencia === "intervalo") {
        dataAtual.setDate(dataAtual.getDate() + intervaloDias);
      } else {
        dataAtual.setDate(dataAtual.getDate() + 1);
      }
    }

    texto += `\n📌 _Tabela gerada por d! Tech Soluções_`;

    setResultado(texto);
  }, [
    descricao,
    cotas,
    valorInicial,
    incremento,
    dataInicio,
    frequencia,
    intervaloDias,
    diasSelecionados,
  ]);

  function copiar() {
    navigator.clipboard.writeText(resultado);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center p-6 text-gray-900">
      <div className="w-full max-w-xl">

        <div className="text-center mb-6">
          <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mb-2">
            Gerador de Tabela
          </div>

          <h1 className="text-2xl font-bold text-green-600">
            d! Tech Soluções
          </h1>

          <p className="text-gray-700 text-sm">
            Consórcio simplificado
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4 text-gray-900">

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Número de cotas</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              value={cotas}
              onChange={(e) => setCotas(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Valor inicial (R$)
            </label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              value={valorInicial}
              onChange={(e) => setValorInicial(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Incremento (R$)
            </label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              value={incremento}
              onChange={(e) => setIncremento(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Data de início</label>
            <input
              type="date"
              className="w-full border rounded-lg p-2 mt-1"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Frequência</label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
              value={frequencia}
              onChange={(e) => setFrequencia(e.target.value)}
            >
              <option value="semanal">Semanal</option>
              <option value="diario">Diário</option>
              <option value="intervalo">A cada X dias</option>
              <option value="mensal">Mensal</option>
              <option value="dias">Dias específicos</option>
            </select>
          </div>

          {frequencia === "intervalo" && (
            <input
              type="number"
              className="w-full border rounded-lg p-2"
              placeholder="Intervalo de dias"
              value={intervaloDias}
              onChange={(e) => setIntervaloDias(Number(e.target.value))}
            />
          )}

          {frequencia === "dias" && (
            <div className="flex flex-wrap gap-2">
              {diasSemana.map((dia, i) => (
                <label key={i} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={diasSelecionados.includes(i)}
                    onChange={() => toggleDia(i)}
                  />
                  {dia}
                </label>
              ))}
            </div>
          )}
        </div>

        {resultado && (
          <div className="bg-white rounded-2xl shadow mt-6 p-4 text-gray-900">
            <div className="flex justify-between mb-2">
              <h2 className="text-sm font-semibold">Resultado</h2>
              <button
                onClick={copiar}
                className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
              >
                Copiar
              </button>
            </div>

            <pre className="bg-gray-100 p-3 rounded-lg text-sm whitespace-pre-wrap">
              {resultado}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}