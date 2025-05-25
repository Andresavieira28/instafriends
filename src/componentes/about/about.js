import React, { useState } from 'react';
import './about.css'; // Vamos criar este arquivo CSS
import Menu from '../menu/menu'; // Importando o componente de menu
import Rodape from '../rodape/rodape'; // Importando o componente de rodapé

const historyPoints = [
  {
    year: '2010',
    title: 'A Faísca: Ideia e Fundação',
    description: 'Sofia Almeida e Lucas Vieira, da USP, idealizam o InstaFriends para conexões autênticas, fugindo dos "filtros" sociais da época.',
    icon: '✨' // Ícone para representar o evento
  },
  {
    year: '2011',
    title: 'Lançamento e Primeiro Impacto',
    description: 'Lançamento oficial em setembro, restrito a universitários. Simplicidade e foco em "tempo real" impulsionam o boca a boca.',
    icon: '🚀'
  },
  {
    year: '2014',
    title: 'Crescimento e Inovação',
    description: 'Abertura para investidores. Introdução de "InstaEventos" e "Momentos Compartilhados" para enriquecer as interações.',
    icon: '📈'
  },
  {
    year: '2019',
    title: 'Consolidação e Futuro',
    description: 'Parcerias locais como modelo de negócio. Foco em IA e "Memórias do Dia" para fortalecer laços duradouros. Privacidade é chave.',
    icon: '💖'
  },
];

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % historyPoints.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + historyPoints.length) % historyPoints.length
    );
  };

  const currentPoint = historyPoints[currentIndex];

  return (
    <div className="about-container">
        <Menu/>
        <div className="instafriends-history-container">
        
        <h2>A Jornada do InstaFriends</h2>

        <div className="history-card">
            <div className="card-header">
            <span className="card-icon">{currentPoint.icon}</span>
            <h3>{currentPoint.year} - {currentPoint.title}</h3>
            </div>
            <p className="card-description">{currentPoint.description}</p>
        </div>

        <div className="navigation-dots">
            {historyPoints.map((_, index) => (
            <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
            ></span>
            ))}
        </div>

        <div className="navigation-buttons">
            <button onClick={handlePrev} disabled={currentIndex === 0}>Anterior</button>
            <button onClick={handleNext} disabled={currentIndex === historyPoints.length - 1}>Próximo</button>
        </div>
        </div>
        <Rodape/>
    </div>
  );
};

export default About;