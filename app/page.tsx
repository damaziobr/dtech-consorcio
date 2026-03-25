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

  // 🔥 auto selecionar dia inicial
  useEffect(() => {
    if (!dataInicio) return;

    const dia = new Date(dataInicio).getDay();

    if (frequencia === "dias") {
      setDiasSelecionados([dia]);
    }
  }, [dataInicio, frequencia]);

  useEffect(() => {
    if (!dataInicio) return;

    let texto = `📊 *d! Tech Soluções - Tabela de Consórcio*\n\n`;
    if (descricao) texto += `${descricao}\n\n`;

    const base = new Date(dataInicio);

    let contador = 1;

    // 🔥 SEM LOOP PESADO
    while (contador <= cotas) {
      let data = new Date(base);

      if (frequencia === "semanal") {
        data.setDate(base.getDate() + (contador - 1) * 7);
      }

      if (frequencia === "diario") {
        data.setDate(base.getDate() + (contador - 1));
      }

      if (frequencia === "mensal") {
        data.setMonth(base.getMonth() + (contador - 1));
      }

      if (frequencia === "intervalo") {
        data.setDate(base.getDate() + (contador - 1) * intervaloDias);
      }

      if (frequencia === "dias") {
        if (diasSelecionados.length === 0) {
          setResultado("⚠️ Selecione pelo menos um dia da semana");
          return;
        }

        let encontrada = false;
        let temp = new Date(base);

        let tentativas = 0;

        while (!encontrada && tentativas < 365) {
          if (diasSelecionados.includes(temp.getDay())) {
            encontrada = true;
            data = new Date(temp);
          }

          temp.setDate(temp.getDate() + 1);
          tentativas++;
        }

        if (!encontrada) break;

        base.setDate(data.getDate() + 1);
      }

      const valor = valorInicial + (contador - 1) * incremento;
      const total = valor * (cotas - 1);

      const dia = data.toLocaleDateString("pt-BR");
      const semana = diasSemana[data.getDay()].toUpperCase();

      texto += `${contador}-${dia} (${semana}) R$ ${valor.toFixed(
        0
      )} = ${total.toFixed(0)}\n`;

      contador++;
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

          <input
            placeholder="Descrição"
            className="w-full border rounded-lg p-2"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <input
            type="number"
            placeholder="Número de cotas"
            className="w-full border rounded-lg p-2"
            value={cotas}
            onChange={(e) => setCotas(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Valor inicial"
            className="w-full border rounded-lg p-2"
            value={valorInicial}
            onChange={(e) => setValorInicial(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Incremento"
            className="w-full border rounded-lg p-2"
            value={incremento}
            onChange={(e) => setIncremento(Number(e.target.value))}
          />

          <input
            type="date"
            className="w-full border rounded-lg p-2"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />

          <select
            className="w-full border rounded-lg p-2"
            value={frequencia}
            onChange={(e) => setFrequencia(e.target.value)}
          >
            <option value="semanal">Semanal</option>
            <option value="diario">Diário</option>
            <option value="intervalo">A cada X dias</option>
            <option value="mensal">Mensal</option>
            <option value="dias">Dias específicos</option>
          </select>

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