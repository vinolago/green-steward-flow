import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addAction } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface SubmissionFormProps {
  userId: string;
  userName: string;
  onSubmit: () => void;
}

export const SubmissionForm = ({ userId, userName, onSubmit }: SubmissionFormProps) => {
  const [activityType, setActivityType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const { toast } = useToast();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activityType || !photoPreview) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addAction({
      user_id: userId,
      user_name: userName,
      activity_type: activityType as any,
      description,
      location,
      photo_url: photoPreview,
      status: 'pending'
    });

    toast({
      title: "Success!",
      description: "Your submission has been sent for verification",
    });

    setActivityType("");
    setDescription("");
    setLocation("");
    setPhotoFile(null);
    setPhotoPreview("");
    onSubmit();
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Submit Land Care Proof</CardTitle>
        <CardDescription>Upload evidence of your restoration activities</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="activity">Activity Type *</Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tree_planting">Tree Planting</SelectItem>
                <SelectItem value="fencing">Fencing</SelectItem>
                <SelectItem value="composting">Composting</SelectItem>
                <SelectItem value="erosion_control">Erosion Control</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your land care activity..."
              className="rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., 40.7128°N, 74.0060°W or City, Region"
              className="rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo Proof *</Label>
            <div className="mt-2">
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <label
                htmlFor="photo"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="h-full object-contain rounded-xl" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload photo</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full rounded-xl">
            Submit for Verification
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
