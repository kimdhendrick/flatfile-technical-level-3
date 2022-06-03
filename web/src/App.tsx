import { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import Section from './components/section'
import SectionI from './types/section'

import './App.css'
import Card from './components/card'

export const BoardContainer = styled.div`
  background-color: rgb(49, 121, 186);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  color: #393939;
  overflow-y: hidden;
  overflow-x: auto;
  position: absolute;
  padding: 5px;
  align-items: flex-start;
`

function App() {
  const [sections, setSections] = useState<SectionI[]>([])

  useEffect(() => {
    axios.get('http://localhost:3001/sections').then((response: { data: SectionI[] }) => {
      // Section order is determined by ID so sort by ID
      const sortedSections = response.data.sort((a: SectionI, b: SectionI) => a.id - b.id)
      setSections(sortedSections)
    })
  })

  const onMoveCard = ((cardId: number, toSectionId: number): void => {
    console.log("Moving card!")
    // find section to remove from
    let cardToMove;
    for (let i = 0; i < sections.length; i++) {
      let section: SectionI = sections[i]
      
      for (let j = 0; j < section.cards.length; j++) {
        let card = section.cards[j]
        if (card.id === cardId) {
          cardToMove = card
          delete section.cards[j]
        }
      }
    }

    // find section to add to
    let sectionsClone: SectionI[] = [...sections]
    for (let i = 0; i < sectionsClone.length; i++) {
      let section: SectionI = sectionsClone[i]
      if (section.id === toSectionId) {
        section.cards.push({
          id: cardId,
          title: cardToMove?.title || 'no title',
          section_id: toSectionId
        })
        setSections(sectionsClone)
      }
    }
    
    setSections(sectionsClone)

    return;
  })

  const onCardSubmit = (sectionId: number, title: string) => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/cards',
      data: { sectionId, title }
    }).then((response: { data: { id: any; title: any } }) => {
      let sectionsClone: SectionI[] = [...sections]
      for (let i = 0; i < sectionsClone.length; i++) {
        let section: SectionI = sectionsClone[i]
        if (section.id === sectionId) {
          section.cards.push({
            id: response.data.id,
            title: response.data.title,
            section_id: sectionId
          })
          setSections(sectionsClone)
        }
      }
    })
  }

  return (
    <BoardContainer>
      {sections.map((section: SectionI) => <Section onMoveCard={onMoveCard} key={section.id} section={section} onCardSubmit={onCardSubmit}></Section>)}
    </BoardContainer>
  )
}

export default App
