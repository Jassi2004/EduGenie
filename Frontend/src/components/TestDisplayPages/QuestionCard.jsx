import { Card, CardHeader, CardBody, RadioGroup, Radio } from "@nextui-org/react";

const QuestionCard = ({ question, index, isSubmitted, selectedOption, handleOptionSelect }) => {
    const correctAnswerText = question.answer;
    const selectedAnswerText = question[`option${selectedOption}`];
    const isCorrect = selectedAnswerText === correctAnswerText;

    return (
        <Card className={`mb-6 ${isSubmitted && (isCorrect ? 'bg-green-100' : 'bg-red-100')}`}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">Question {index + 1}</p>
                <h4 className="font-bold text-large">{question.question}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <RadioGroup
                    value={selectedOption || ''}
                    onValueChange={(value) => handleOptionSelect(question.qId, value)}
                    isDisabled={isSubmitted}
                >
                    {['A', 'B', 'C', 'D'].map((option) => {
                        const optionText = question[`option${option}`];
                        return (
                            <Radio key={option} value={option}>
                                {optionText}
                            </Radio>
                        );
                    })}
                </RadioGroup>
                {isSubmitted && (
                    <p className={`mt-2 font-semibold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                        {isCorrect ? 'Correct!' : `Incorrect. Correct Answer: ${correctAnswerText}`}
                    </p>
                )}
            </CardBody>
        </Card>
    );
};

export default QuestionCard;
