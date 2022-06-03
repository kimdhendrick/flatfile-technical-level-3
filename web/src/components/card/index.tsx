import styled from 'styled-components'

const CardContainer = styled.div`
  border-radius: 3px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  position: relative;
  padding: 10px;
  cursor: pointer;
  max-width: 250px;
  margin-bottom: 7px;
  min-width: 230px;
`

const CardTitle = styled.div``
const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
  event.dataTransfer.setData('text', event.currentTarget.id)
  console.log("Started dragging... cardId: ", event.currentTarget.id)
}

const Card = ({ card: { id, title } }: any) => (
  <CardContainer id={id} className='card' draggable="true" onDragStart={handleDragStart}>
    <CardTitle>{title}</CardTitle>
  </CardContainer>
)

export default Card
