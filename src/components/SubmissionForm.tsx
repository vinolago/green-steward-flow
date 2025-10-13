import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

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
  const [isLoading, setIsLoading] = useState(false);
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

  const uploadPhotoToSupabase = async (file: File): Promise<string | null> => {
    if (file.size > 5 * 1024 * 1024) {
    toast({
      title: "File too large",
      description: "Please upload an image smaller than 5MB.",
      variant: "destructive",
    });
    return null;
  }
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        contentType: file.type,
      });
    
    if (error) {
      console.error("Photo upload failed:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload photo. Please try again.",
        variant: "destructive",
      });
      return null;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    return data?.publicUrl || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activityType || !photoFile) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const photoUrl = await uploadPhotoToSupabase(photoFile);
      if (!photoUrl) throw new Error("Failed to upload photo");

      const { error } = await supabase.from("submissions").insert([
        {
          user_id: userId,
          user_name: userName,
          activity_type: activityType,
          description,
          location,
          photo_url: photoUrl,
          status: "pending",
        },
      ]);

      if (error) throw error;

      console.log("Upload error details:", error);


      toast({
        title: "Success!",
        description: "Your submission has been sent for verification.",
      });

      // Reset form
      setActivityType("");
      setDescription("");
      setLocation("");
      setPhotoFile(null);
      setPhotoPreview("");

      onSubmit();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Submission failed",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

          <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit for Verification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
