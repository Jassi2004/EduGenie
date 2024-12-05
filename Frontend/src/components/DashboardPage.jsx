import { useEffect, useState } from "react";
import { Button, Card, CardHeader, CardBody } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TestTube, Notebook, Upload, ArrowDown } from "lucide-react";
import Overview from "./DashBoardComponents/Overview";
import PublishedNotesPage from "./PublishedNotesPage";
import GenerationsExhaustedModal from "./DashBoardComponents/GenerationsExhaustedModal";
import api from "../../axiosConfig";

// const DashboardCard = ({
//   title,
//   description,
//   icon: Icon,
//   onClick,
//   gradientFrom,
//   gradientTo,
// }) => (
//   <div className="perspective-1000 transform-style-3d">
//     <Card
//       className={`
//         relative overflow-hidden bg-white border-2 border-transparent
//         rounded-3xl shadow-2xl transition-all duration-500 ease-in-out
//         hover:scale-[1.03] hover:border-cyan-300

//       `}
//     >
//       <div
//         className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-0 transition-opacity duration-500 pointer-events-none hover:opacity-100`}
//       />
//       <CardHeader
//         className="relative z-10 flex flex-col items-center justify-center text-center pt-8 pb-4"
//       >
//         <div className="bg-cyan-100 p-4 rounded-full mb-4">
//           <Icon className="text-cyan-600 w-12 h-12" />
//         </div>
//         <h1
//           className="
//             text-4xl font-extrabold bg-clip-text text-transparent 
//             bg-gradient-to-r from-cyan-500 to-blue-600
//           "
//         >
//           {title}
//         </h1>
//       </CardHeader>
//       <CardBody className="relative z-10 flex flex-col items-center justify-center space-y-4 px-6 pb-8">
//         <p className="text-gray-600 text-center text-sm leading-relaxed">
//           {description}
//         </p>
//         <Button
//           onClick={onClick}
//           className="
//             group relative px-8 py-3 rounded-full 
//             bg-gradient-to-r from-cyan-500 to-blue-600 
//             text-white font-bold hover:from-cyan-600 hover:to-blue-700 
//             transition-all duration-300 shadow-lg hover:shadow-2xl active:scale-95
//           "
//         >
//           Get Started
//         </Button>
//       </CardBody>
//     </Card>
//   </div>
// );


const DashboardCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  gradientFrom,
  gradientTo,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="perspective-1000 transform-style-3d"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`
          relative overflow-hidden 
          bg-white border-2 border-transparent
          rounded-3xl shadow-2xl 
          transition-all duration-500 ease-in-out
          ${isHovered ? 'border-cyan-300 shadow-[0_0_40px_rgba(14,165,233,0.3)]' : ''}
          hover:scale-[1.03]
          transform origin-center
          w-full max-w-sm mx-auto pop-up
        `}
      >
        {/* Holographic Border Effect */}
        <div
          className={`
            absolute inset-0 rounded-3xl 
            bg-gradient-to-r ${gradientFrom} ${gradientTo}
            opacity-0 transition-opacity duration-500
            pointer-events-none
            ${isHovered ? 'opacity-100' : ''}
          `}
        />

        {/* Animated Particle Background */}
        <div
          className="absolute inset-0 overflow-hidden opacity-10"
          style={{
            background: `
              radial-gradient(circle at top right, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
              radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.1) 0%, transparent 50%)
            `,
          }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-cyan-300/50 rounded-full animate-float"
              style={{
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <CardHeader
          className="relative z-10 flex flex-col items-center 
          justify-center text-center pt-8 pb-4"
        >
          <div
            className={`
              bg-cyan-100 p-4 rounded-full mb-4 
              transition-all duration-500
              ${isHovered ? 'rotate-[360deg] scale-110' : ''}
            `}
          >
            <Icon
              className="text-cyan-600 w-12 h-12 
              transition-all duration-500
            "
            />
          </div>
          <h1
            className="
              text-4xl font-extrabold 
              bg-clip-text text-transparent 
              bg-gradient-to-r from-cyan-500 to-blue-600 
              tracking-tight
              transition-all duration-500
            "
          >
            {title}
          </h1>
        </CardHeader>

        <CardBody
          className="relative z-10 flex flex-col items-center 
          justify-center space-y-4 px-6 pb-8"
        >
          <p
            className="
              text-gray-600 text-center text-sm 
              tracking-wide leading-relaxed
              transition-all duration-500
              opacity-70
            "
          >
            {description}
          </p>

          <Button
            onClick={onClick} // Simpler onClick logic from Component 1
            className={`
              group relative px-8 py-3 rounded-full 
              bg-gradient-to-r from-cyan-500 to-blue-600 
              text-white font-bold 
              hover:from-cyan-600 hover:to-blue-700 
              transition-all duration-300 
              shadow-lg hover:shadow-2xl 
              active:scale-95
              flex items-center gap-2
            `}
          >
            <ArrowDown
              className="
                w-5 h-5 
                transition-all duration-300 
                group-hover:rotate-45
              "
            />
            Get Started
          </Button>
        </CardBody>

        {/* Futuristic Accent Line */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-1 
            bg-gradient-to-r from-transparent via-cyan-500 
            to-transparent opacity-50
            transition-all duration-500
            ${isHovered ? 'scale-x-110' : ''}
          `}
        />
      </Card>
    </div>
  );
};


const Dashboard = () => {
  const navigate = useNavigate();

  const [generationsRemaining, setGenerationsRemaining] = useState(10); // Default value aligned with free plan
  const [isGenerationsExhausted, setIsGenerationsExhausted] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const fetchGenerationsRemaining = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await api.get(`${import.meta.env.VITE_BACKEND_URL}api/get-user-details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const generationsLeft = response.data.generationsLeft;
      setGenerationsRemaining(generationsLeft);
    } catch (error) {
      console.error("Error fetching generations:", error);
    }
  };
  useEffect(() => {
    fetchGenerationsRemaining();
  }, [generationsRemaining]);

  const handleNavigationWithAuth = async (url) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          navigate(url);
        } else {
          alert("Invalid or expired token. Please log in again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during token validation:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("You need to log in first!");
      navigate("/login");
    }
  };

  const handleAction = (type) => {
    fetchGenerationsRemaining();
    if (generationsRemaining <= 0) {
      setModalContent(type);
      setIsGenerationsExhausted(true);
    } else {
      const url = type === "test" ? "/generate-test" : "/generate-notes";
      handleNavigationWithAuth(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 mt-14">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700 pop-up">
            Study Smarter, Not Harder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto pop-up">
            Leverage AI-powered tools to transform your learning experience. Generate tests, create notes, and share knowledge with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DashboardCard
            title="Generate Test"
            description="Craft precision-engineered practice tests with intelligent design"
            icon={TestTube}
            onClick={() => handleAction("test")}
            gradientFrom="from-cyan-200/30"
            gradientTo="to-indigo-200/30"
          />
          <DashboardCard
            title="Generate Notes"
            description="Quickly create organized notes for your meetings or study sessions"
            icon={Notebook}
            onClick={() => handleAction("notes")}
            gradientFrom="from-green-200/30"
            gradientTo="to-teal-200/30"
          />
          <DashboardCard
            title="Publish Notes"
            description="Share your knowledge and help fellow learners grow"
            icon={Upload}
            onClick={() => handleNavigationWithAuth("/publish-notes")}
            gradientFrom="from-purple-200/30"
            gradientTo="to-pink-200/30"
          />
        </div>

        <Overview />

        <div className="mt-56 bg-white/50 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center">
            <PublishedNotesPage />
          </div>
        </div>

        <GenerationsExhaustedModal
          isOpen={isGenerationsExhausted}
          onClose={() => setIsGenerationsExhausted(false)}
          content={modalContent}
          redirectToPayments={() => navigate("/payments")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
