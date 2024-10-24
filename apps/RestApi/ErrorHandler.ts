import { Response } from 'express';
import { AuthenticationError } from "@/core/shared/exceptions/AuthenticationError";
import { AuthorizationError } from "@/core/shared/exceptions/AuthorizationError";
import { ConnectionError } from "@/core/shared/exceptions/ConnectionError";
import { DomainError } from "@/core/shared/exceptions/DomainError";
import { DuplicateError } from "@/core/shared/exceptions/DuplicateError";
import { FileError } from "@/core/shared/exceptions/FileError";
import { NotFoundError } from "@/core/shared/exceptions/NotFoundError";
import { NullPointerError } from "@/core/shared/exceptions/NullPointerError";
import { RuntimeError } from "@/core/shared/exceptions/RuntimeError";
import { TimeoutError } from "@/core/shared/exceptions/TimeoutError";
import { ValidationError } from "@/core/shared/exceptions/ValidationError";

export class ErrorHandler {
    static handleError(error: Error | null, res: Response): void {
        if (error === null) {
            res.status(500).json({ message: "An unexpected error occurred" });
        } else if (error instanceof AuthenticationError) {
            res.status(401).json({ message: error.message });
        } else if (error instanceof AuthorizationError) {
            res.status(403).json({ message: error.message });
        } else if (error instanceof ConnectionError) {
            res.status(503).json({ message: error.message });
        } else if (error instanceof DomainError) {
            res.status(400).json({ message: error.message });
        } else if (error instanceof DuplicateError) {
            res.status(409).json({ message: error.message });
        } else if (error instanceof FileError) {
            res.status(500).json({ message: error.message });
        } else if (error instanceof NotFoundError) {
            res.status(404).json({ message: error.message });
        } else if (error instanceof NullPointerError) {
            res.status(500).json({ message: error.message });
        } else if (error instanceof RuntimeError) {
            res.status(500).json({ message: error.message });
        } else if (error instanceof TimeoutError) {
            res.status(504).json({ message: error.message });
        } else if (error instanceof ValidationError) {
            res.status(422).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
}