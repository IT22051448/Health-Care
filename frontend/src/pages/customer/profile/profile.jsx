import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const ShoppingProfile = () => {
  const { user } = useSelector((state) => state.auth);

  console.log(user);
  return (
    <div className="p-4">
      <Card className="p-6 shadow-lg">
        <h2
          className="text-lg font-semibold text-center
"
        >
          Your QR Code
        </h2>
        {user ? (
          <div className="my-4">
            <img src={user.QRCodeUrl} alt="QR Code" className="w-64 h-64" />
          </div>
        ) : (
          <p>No QR code available.</p>
        )}
        <Button
          onClick={() => {
            console.log("Download QR");
          }}
          disabled={!user.qrCodeUrl}
        >
          Download QR Code
        </Button>
      </Card>
    </div>
  );
};

export default ShoppingProfile;
