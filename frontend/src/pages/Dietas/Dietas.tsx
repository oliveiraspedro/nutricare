import React, { useState } from "react";
import './Dietas.css';
import '../../components/Footer/Footer.css';
import { MdRestaurant } from "react-icons/md";

const Dietas: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleREF = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const refs = [
    {
      question: "Refeição 1",
      answer: [
        { nome: "Pão francês", qtd: "1 unidade(s) ou 50g" },
        { nome: "Ovo de galinha", qtd: "1 unidade(s) ou 50g" }
      ]
    },
    {
      question: "Refeição 2",
      answer: [
        { nome: "Banana prata", qtd: "1 unidade(s) ou 86g" },
        { nome: "Aveia", qtd: "2 colheres de sopa" }
      ]
    },
    {
      question: "Refeição 3",
      answer: [
        { nome: "Arroz integral", qtd: "3 colheres de sopa" },
        { nome: "Peito de frango", qtd: "100g" },
        { nome: "Brócolis cozido", qtd: "1 xícara" }
      ]
    }
  ];

  return (
    <>
      <section className="ref">
        <div className="container-dieta">
          <div className="container-title">
            <div className="dietaTitle">
              <h2>Minha Dieta</h2>
            </div>
          </div>
          {refs.map((ref, index) => (
            <div className="ref-item" key={index}>
              <button
                onClick={() => toggleREF(index)}
                className={`ref-question ${openIndex === index ? 'open' : ''}`}
                aria-expanded={openIndex === index ? 'true' : 'false'}
              >
                <span className="ref-icon"><MdRestaurant /></span>
                {ref.question}
                <span className="arrow">{openIndex === index ? '▲' : '▼'}</span>
              </button>
              {openIndex === index && (
                <div className="ref-answer">
                  {ref.answer.map((item, i) => (
                    <div key={i} className="ref-food">
                      <strong>{item.nome}</strong>
                      <p>{item.qtd}</p>
                      {i < ref.answer.length - 1 && <hr />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Dietas;
