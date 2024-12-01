import imageSrc from "@/public/images/workflow-01.png";
import Card from "../../../../components/cards/card";
import ImageVehicle01 from "@/public/images/vehicles/vehicle-01.png";
import ImageVehicle02 from "@/public/images/vehicles/vehicle-02.png";
import ImageVehicle03 from "@/public/images/vehicles/vehicle-03.png";

const vehicles = [
    {
        id: 1,
        imageSrc: ImageVehicle01,
        marque: "Renault",
        modele: "Clio",
        annee: 2022,
        tarifLocation: 45,
        type: "Citadine",
        to: "#"
    },
    {
        id: 2,
        imageSrc: ImageVehicle02,
        marque: "Peugeot",
        modele: "3008",
        annee: 2021,
        tarifLocation: 75,
        type: "SUV",
        to: "#"
    },
    {
        id: 3,
        imageSrc: ImageVehicle03,
        marque: "Citroën",
        modele: "C3",
        annee: 2023,
        tarifLocation: 50,
        type: "Compacte",
        to: "#"
    },
    {
        id: 4,
        imageSrc: ImageVehicle01,
        marque: "BMW",
        modele: "Série 5",
        annee: 2022,
        tarifLocation: 120,
        type: "Berline",
        to: "#"
    }
]
export default function page(){
    return (
        <section className="pt-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="pb-12 md:pb-20">
                    <div className="mx-auto max-w-3xl pb-12 text-center md:pb-10 ">
                        <h2 className="text-3xl font-semibold">Map your product journey</h2>
                        <p className="text-lg text-indigo-200/65">
                            Simple and elegant interface to start collaborating with your team in minutes.
                        </p>
                    </div>
                    <div className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
                        {vehicles.map((vehicle) => (
                            <Card
                                key={vehicle.id}
                                imageSrc={vehicle.imageSrc}
                                marque={vehicle.marque}
                                modele={vehicle.modele}
                                annee={vehicle.annee}
                                tarifLocation={vehicle.tarifLocation}
                                type={vehicle.type}
                                to={vehicle.to}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}