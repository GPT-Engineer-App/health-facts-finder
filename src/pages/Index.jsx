import React, { useRef, useState, useEffect } from "react";
import { Box, Button, VStack, Text, useToast, Heading, List, ListItem, ListIcon, Image } from "@chakra-ui/react";
import { FaCamera, FaSearch } from "react-icons/fa";
import { MdCheckCircle, MdError } from "react-icons/md";

const Index = () => {
  const videoRef = useRef(null);
  const [streamStarted, setStreamStarted] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (streamStarted) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setPermissionGranted(true);
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            description: "Could not access camera.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          setPermissionGranted(false);
        });
    }
  }, [streamStarted, toast]);

  const captureImage = async () => {
    if (videoRef.current && permissionGranted) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      const image = canvas.toDataURL("image/png");

      // Placeholder for API call to analyze the image
      const mockApiResponse = await analyzeImage(image);
      setIngredients(mockApiResponse);
    }
  };

  // Mock function to simulate backend API call
  const analyzeImage = async (imageData) => {
    // Replace this with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: "Ingredient 1", riskLevel: "High", reason: "Reason for high risk" },
          { name: "Ingredient 2", riskLevel: "Medium", reason: "Reason for medium risk" },
          { name: "Ingredient 3", riskLevel: "Low", reason: "Reason for low risk" },
        ]);
      }, 2000);
    });
  };

  return (
    <VStack spacing={4}>
      <Heading>Ingredient Analyzer</Heading>
      <Text>Find out what's in your products, and what it means for your health.</Text>

      {!streamStarted ? (
        <Button leftIcon={<FaCamera />} colorScheme="teal" onClick={() => setStreamStarted(true)}>
          Start Camera
        </Button>
      ) : (
        <Box>
          {permissionGranted ? (
            <Box>
              <video ref={videoRef} autoPlay={true} playsInline={true} style={{ width: "100%", height: "auto" }}></video>
              <Button leftIcon={<FaSearch />} colorScheme="blue" onClick={captureImage}>
                Capture Image
              </Button>
            </Box>
          ) : (
            <Text>Camera permission is required to continue.</Text>
          )}
        </Box>
      )}

      <List spacing={3}>
        {ingredients.map((ingredient, index) => (
          <ListItem key={index}>
            <ListIcon as={ingredient.riskLevel === "High" ? MdError : MdCheckCircle} color={ingredient.riskLevel === "High" ? "red.500" : "green.500"} />
            <Text as="span" fontWeight="bold">
              {ingredient.name}
            </Text>
            <Text as="span"> ({ingredient.riskLevel}) - </Text>
            <Text as="span">{ingredient.reason}</Text>
          </ListItem>
        ))}
      </List>
    </VStack>
  );
};

export default Index;
