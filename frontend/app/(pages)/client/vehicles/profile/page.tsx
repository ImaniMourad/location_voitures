import PageIllustration from "@/components/page-illustration";
import CustomerProfile from "@/components/profileClient";
import VehicleProfile from "@/components/profileVehicule";

export default function ProfilePage() {

  return (
    <div>
        <br />
      <VehicleProfile
  imageSrc="/images/workflow-01.png"
  marque="Tesla"
  modele="Model S"
  annee={2023}
  tarifLocation={120}
  type="Berline électrique"
  description="Une berline de luxe électrique offrant une performance exceptionnelle et une autonomie impressionnante."
  motorisation="Électrique, 670 ch"
  transmission="Automatique"
  consommation={16}
  dimensions="Longueur: 4.97m, Largeur: 1.96m, Hauteur: 1.45m"
  options={["Climatisation", "GPS intégré", "Sièges chauffants", "Toit panoramique"]}
  to="/reservation"
 />

      </div>
  );
}
