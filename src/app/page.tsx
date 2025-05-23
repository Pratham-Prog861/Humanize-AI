"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  detectAiContent,
  DetectAiContentInput,
  DetectAiContentOutput,
} from "@/ai/flows/detect-ai-content";
import {
  humanizeAiContent,
  HumanizeAiContentInput,
  HumanizeAiContentOutput,
} from "@/ai/flows/humanize-ai-content";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/loader";
import { Copy, Check, ScanText, BotMessageSquare } from "lucide-react"; // Add Copy and Check icons
import Footer from "@/components/Footer";

export default function AIGuardPage() {
  const [inputText, setInputText] = React.useState("");
  const [originalTextForComparison, setOriginalTextForComparison] =
    React.useState("");
  const [detectionScore, setDetectionScore] = React.useState<number | null>(
    null
  );
  const [humanizedText, setHumanizedText] = React.useState<string | null>(null);
  const [isRewritten, setIsRewritten] = React.useState<boolean | null>(null);
  const [isLoadingDetection, setIsLoadingDetection] = React.useState(false);
  const [isLoadingHumanizing, setIsLoadingHumanizing] = React.useState(false);

  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setDetectionScore(null);
    setHumanizedText(null);
    setOriginalTextForComparison("");
    setIsRewritten(null);
  };

  const handleDetectAI = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to analyze.",
        variant: "default",
      });
      return;
    }
    setIsLoadingDetection(true);
    setDetectionScore(null);

    try {
      const result: DetectAiContentOutput = await detectAiContent(
        inputText as DetectAiContentInput
      );
      setDetectionScore(result.aiDetectionScore);
    } catch (err) {
      console.error("Detection error in page:", err); // Added client-side logging
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unknown error occurred during AI detection.";
      toast({
        title: "Detection Error",
        description: errorMessage,
        variant: "destructive",
      });
      setDetectionScore(0); // Set to 0 on error so something is displayed
    } finally {
      setIsLoadingDetection(false);
    }
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to humanize.",
        variant: "default",
      });
      return;
    }
    setIsLoadingHumanizing(true);
    setHumanizedText(null);
    setOriginalTextForComparison(inputText);
    setIsRewritten(null);

    try {
      const result: HumanizeAiContentOutput = await humanizeAiContent({
        text: inputText,
      } as HumanizeAiContentInput);
      setHumanizedText(result.humanizedText);
      setIsRewritten(result.isRewritten);
      if (result.isRewritten === false) {
        toast({
          title: "Content Unchanged",
          description:
            "The AI determined the text already sounded human-like and did not require rewriting.",
          variant: "default",
        });
      }
    } catch (err) {
      console.error("Humanizing error in page:", err); // Added client-side logging
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unknown error occurred while humanizing text.";
      toast({
        title: "Humanization Error",
        description: errorMessage,
        variant: "destructive",
      });
      setHumanizedText(null);
      setOriginalTextForComparison("");
      setIsRewritten(null);
    } finally {
      setIsLoadingHumanizing(false);
    }
  };

  const [hasCopied, setHasCopied] = React.useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const scrollToAnalyzeSection = () => {
    const analyzeSection = document.getElementById('analyze-section');
    if (analyzeSection) {
      analyzeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/95 to-accent/5">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6 animate-gradient">
            AI Content Detection & Humanization
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform AI-generated content into natural, human-like text while
            preserving the original message. Powered by advanced AI detection
            technology.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={scrollToAnalyzeSection} 
              className="px-8 py-6 text-lg bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
            <a href="/about">
              <Button variant="outline" className="px-8 py-6 text-lg">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        <div id="analyze-section" className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Detect & Humanize AI Content
          </h2>
          <p className="text-lg text-muted-foreground">
            Transform AI-generated content into natural, human-like text while
            maintaining its core message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-2xl rounded-xl border border-accent/20 bg-gradient-to-br from-background to-accent/5 hover:shadow-accent/5 transition-all duration-300">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">
                Analyze Your Text
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Paste your text below to detect AI generation likelihood and
                humanize it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Paste your text here..."
                value={inputText}
                onChange={handleInputChange}
                rows={12}
                className="resize-y min-h-[200px] shadow-inner focus:ring-2 focus:ring-primary"
                aria-label="Text input for AI analysis"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleDetectAI}
                  disabled={
                    !inputText.trim() ||
                    isLoadingDetection ||
                    isLoadingHumanizing
                  }
                  className="w-full sm:flex-1 py-3 text-base"
                  aria-live="polite"
                >
                  {isLoadingDetection ? (
                    <Loader />
                  ) : (
                    <>
                      <ScanText className="mr-2 h-5 w-5" /> Detect AI
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleHumanize}
                  disabled={
                    !inputText.trim() ||
                    isLoadingDetection ||
                    isLoadingHumanizing
                  }
                  className="w-full sm:flex-1 py-3 text-base bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent"
                  aria-live="polite"
                >
                  {isLoadingHumanizing ? <Loader /> : "Humanize Content"}
                </Button>
              </div>

              {detectionScore !== null && (
                <div className="mt-6 p-4 border border-accent/30 rounded-lg bg-accent/5 transition-all duration-300 ease-in-out">
                  <h3 className="text-lg font-semibold text-accent mb-2">
                    AI Detection Score
                  </h3>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={detectionScore}
                      className="w-full h-3 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-teal-400"
                      aria-label={`AI Detection Score: ${detectionScore}%`}
                    />
                    <span className="text-xl font-bold text-accent">
                      {detectionScore}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Likelihood of the text being AI-generated.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-2xl rounded-xl border border-accent/20 bg-gradient-to-br from-background to-accent/5 hover:shadow-accent/5 transition-all duration-300">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">
                Comparison
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                View the original and humanized text side-by-side after
                processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[300px] flex flex-col">
              {isLoadingHumanizing && !humanizedText && (
                <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                  <Loader size="lg" className="text-primary mb-4" />
                  <p className="text-muted-foreground">
                    Humanizing content, please wait...
                  </p>
                </div>
              )}
              {!isLoadingHumanizing &&
              humanizedText &&
              originalTextForComparison ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">
                      Original Text
                    </h4>
                    <ScrollArea className="h-72 p-3 border rounded-md bg-muted/30 shadow-inner">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {originalTextForComparison}
                      </pre>
                    </ScrollArea>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-foreground">
                        Humanized Text
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-accent"
                        onClick={() => copyToClipboard(humanizedText)}
                      >
                        {hasCopied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        <span className="sr-only">Copy to clipboard</span>
                      </Button>
                    </div>
                    <ScrollArea className="h-72 p-3 border rounded-md bg-background shadow-inner relative group">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {humanizedText}
                      </pre>
                    </ScrollArea>
                    {isRewritten === false && (
                      <p className="text-xs text-center text-muted-foreground mt-2 italic">
                        AI determined the original text was already human-like.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                !isLoadingHumanizing && (
                  <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                    <ScanText
                      size={48}
                      className="text-muted-foreground/50 mb-3"
                    />
                    <p className="text-muted-foreground">
                      {inputText.trim() && !originalTextForComparison
                        ? "Click 'Humanize' to see the rewritten version here."
                        : "Results will appear here after humanizing text."}
                    </p>
                    {!inputText.trim() && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Start by pasting text in the input area.
                      </p>
                    )}
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
