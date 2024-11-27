import { Card, CardBody, Progress } from "@nextui-org/react";

const ScoreCard = ({ score, total }) => {
    return (
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500">
            <CardBody>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Your Score: {score} out of {total}
                </h2>
                <Progress
                    value={(score / total) * 100}
                    color="success"
                    className="mt-2"
                />
            </CardBody>
        </Card>
    );
};

export default ScoreCard;
