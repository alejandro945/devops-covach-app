import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  //   FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/authContext";
import { useCommonContext } from "../contexts/commonContext";

const PRODUCT_SERVICE_URL = `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_BASE_URL}/products`;

export default function AddProductForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token } = useAuthContext();
  const { setLoading, fetchProducts } = useCommonContext();

  const [data, setData] = useState({
    name: "",
    description: "",
    price: 100,
    image: "",
  });
  const [disableSubmit, setDisableSubmit] = useState(true);

  const handleChangeData = (e, name) => {
    setData({
      ...data,
      [name]: e.target.value,
    });
  };

  useEffect(() => {
    if (data.name && data.description && data.price && data.image) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [data]);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch(PRODUCT_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.ok) {
      onClose();
      await fetchProducts("");
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Add new product</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Property name</FormLabel>
              <Input
                name="name"
                type="text"
                onChange={(e) => handleChangeData(e, "name")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Property description</FormLabel>
              <Textarea
                type="text"
                size="sm"
                onChange={(e) => handleChangeData(e, "description")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Price per night</FormLabel>
              <NumberInput
                step={10}
                defaultValue={100}
                min={1}
                max={5000}
                onChange={(value) => {
                  setData({
                    ...data,
                    price: value,
                  });
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Property image link</FormLabel>
              <Input
                type="text"
                onChange={(e) => handleChangeData(e, "image")}
                name="image"
              />
              <FormHelperText>
                We need a full link to a image file
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              disabled={disableSubmit}
            >
              Post
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
