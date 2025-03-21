import React from "react";
import { Button } from "./button";
import { Input } from "./input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

export function VariantsDemo() {
  return (
    <div className="space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Kleiderzauber Button Variants</CardTitle>
          <CardDescription>
            Custom buttons designed specifically for Kleiderzauber
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium">Brand Variants</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="brand">Brand Button</Button>
                  <Button variant="brand-secondary">Brand Secondary</Button>
                  <Button variant="brand-outline">Brand Outline</Button>
                  <Button variant="brand-ghost">Brand Ghost</Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium">Sizes</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="brand" size="sm">
                  Small
                </Button>
                <Button variant="brand">Default</Button>
                <Button variant="brand" size="lg">
                  Large
                </Button>
                <Button variant="brand" size="xl">
                  Extra Large
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium">Rounded Corners</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="brand" rounded="none">
                  No Rounded
                </Button>
                <Button variant="brand" rounded="default">
                  Default Rounded
                </Button>
                <Button variant="brand" rounded="full">
                  Fully Rounded
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium">Animations</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="brand" animation="wiggle">
                  Wiggle
                </Button>
                <Button variant="brand" animation="pulse">
                  Pulse
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kleiderzauber Input Variants</CardTitle>
          <CardDescription>
            Custom inputs designed specifically for Kleiderzauber
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium">Variants</h3>
              <div className="space-y-4">
                <Input placeholder="Default Input" />
                <Input placeholder="Brand Input" variant="brand" />
                <Input placeholder="Filled Input" variant="filled" />
                <Input
                  placeholder="Brand Filled Input"
                  variant="brand-filled"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium">Sizes</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Small Input"
                  variant="brand"
                  inputSize="sm"
                />
                <Input placeholder="Default Input" variant="brand" />
                <Input
                  placeholder="Large Input"
                  variant="brand"
                  inputSize="lg"
                />
                <Input
                  placeholder="Extra Large Input"
                  variant="brand"
                  inputSize="xl"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium">Rounded Corners</h3>
              <div className="space-y-4">
                <Input
                  placeholder="No Rounded"
                  variant="brand"
                  rounded="none"
                />
                <Input placeholder="Default Rounded" variant="brand" />
                <Input
                  placeholder="Fully Rounded"
                  variant="brand"
                  rounded="full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
