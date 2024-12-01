import WorflowImg01 from "@/public/images/workflow-01.png";
import WorflowImg02 from "@/public/images/workflow-02.png";
import WorflowImg03 from "@/public/images/workflow-03.png";
import Card from "@/components/cards/card";

export default function Workflows() {
  const cardsData = [
    {
      imageSrc: WorflowImg01,
      imageAlt: "Workflow 01",
      title: "Built-in Tools",
      description: "Streamline the product development flow with a content platform that's aligned across specs and insights.",
      badge: "Built-in Tools",
    },
    {
      imageSrc: WorflowImg02,
      imageAlt: "Workflow 02",
      title: "Scale Instantly",
      description: "Quickly adapt to the needs of your growing team and accelerate your workflow.",
      badge: "Scale Instantly",
    },
    {
      imageSrc: WorflowImg03,
      imageAlt: "Workflow 03",
      title: "Tailored Flows",
      description: "Customize workflows to match the exact needs of your projects and teams.",
      badge: "Tailored Flows",
    },
  ];

  return (
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="pb-12 md:pb-20">
            <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
              <h2 className="text-3xl font-semibold">Map your product journey</h2>
              <p className="text-lg text-indigo-200/65">
                Simple and elegant interface to start collaborating with your team in minutes.
              </p>
            </div>
            <div className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
              {cardsData.map((card, index) => (
                  <Card
                      key={index}
                      imageSrc={card.imageSrc}
                      imageAlt={card.imageAlt}
                      title={card.title}
                      description={card.description}
                      badge={card.badge}
                  />
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}
