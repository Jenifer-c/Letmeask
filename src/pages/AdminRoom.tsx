import '../styles/room.scss';

//Dependências do React
import { useHistory, useParams } from 'react-router-dom';

//Componentes
import { Button   } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';


//Imagens
import logoImg      from '../assets/images/logo.svg';
import deleteImg    from '../assets/images/delete.svg';
import checkImg     from '../assets/images/check.svg';
import answerImg    from '../assets/images/answer.svg';

import { useRoom }  from '../hooks/useRoom';
import { database } from '../services/firebase';


type RoomsParamsUrl = {
    id : string;
}


export function AdminRoom() {

    const history   = useHistory()
    const paramsUrl = useParams<RoomsParamsUrl>();
    
    const { title, questions } = useRoom( paramsUrl.id )

    async function handleEndRoom() {
        await database.ref(`rooms/${paramsUrl.id}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }
 
    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${paramsUrl.id}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${paramsUrl.id}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${paramsUrl.id}/questions/${questionId}`).update({
            isHighLighted: true,
        })
    }

    return(
        <div id = "page-room" >

            <header>
                <div className = "content" >
                    <img src = { logoImg } alt = "Letmeask" />
                    <div>
                        <RoomCode code = { paramsUrl.id } />
                        <Button isOutlined onClick = { handleEndRoom }> Encerrar sala </Button>
                    </div>
                </div>
            </header>

            <main>
                <div className = "room-title" >
                    <h1> Sala { title } </h1>
                    { questions.length > 0 &&  <span> { questions.length } Pergunta(s) </span> }
                </div>
                <div className = "question-list"  >
                    {questions.map( question => {
                        return (
                            <Question 
                                key           = { question.id }
                                content       = { question.content }
                                author        = { question.author }
                                isAnswered    = { question.isAnswered }
                                isHighLighted = { question.isHighLighted }
                            >
                                { !question.isAnswered && (
                                    <>
                                        <button
                                            type    = "button"
                                            onClick = { () => handleCheckQuestionAsAnswered( question.id ) }
                                        >
                                            <img src = { checkImg } alt = "Marcar pergunta como respondida" />
                                        </button>

                                        <button
                                            type    = "button"
                                            onClick = { () => handleHighlightQuestion( question.id ) }
                                        >
                                            <img src = { answerImg } alt = "Dar destaque à pergunta" />
                                        </button>
                                    </>
                                )}

                                <button
                                    type    = "button"
                                    onClick = { () => handleDeleteQuestion( question.id ) }
                                >
                                    <img src = { deleteImg } alt = "Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>

            </main>
        
        </div>
    );
}