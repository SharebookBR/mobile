import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../models/book';
import { BooksVM } from '../../models/booksVM';
import { DonateBookUser } from '../../models/donateBookUser';
import { map } from 'rxjs/operators';
import { config } from "../../../environments/environment";

@Injectable()
export class BookService {
  
  constructor(private _http: HttpClient) {}

  public getAll() {
    return this._http.get<BooksVM[]>(`${config.apiEndpoint}/book/1/100`);
  }

  public getTop15NewBooks() {
    return this._http.get<Book[]>(`${config.apiEndpoint}/book/Top15NewBooks`);
  }

  public getRandom15Books() {
    return this._http.get<Book[]>(`${config.apiEndpoint}/book/Random15Books`);
  }

  public create(book) {
    return this._http.post<any>(`${config.apiEndpoint}/book`, book);
  }

  public getById(bookId: string) {
    return this._http.get<Book>(`${config.apiEndpoint}/book/${bookId}`);
  }

  public getBySlug(bookSlug: string) {
    return this._http.get<Book>(`${config.apiEndpoint}/book/Slug/${bookSlug}`);
  }

  public update(book: Book) {
    return this._http.put<Book>(`${config.apiEndpoint}/book/${book.id}`, book);
  }

  public delete(bookId: number) {
    return this._http.delete(`${config.apiEndpoint}/book/${bookId}`);
  }

  public getFreightOptions() {
    return this._http.get<any>(`${config.apiEndpoint}/book/freightOptions`).pipe(
      map(response => {
        return response;
      })
    );
  }

  public getGranteeUsersByBookId(bookId: string) {
    return this._http.get(`${config.apiEndpoint}/book/GranteeUsersByBookId/${bookId}`);
  }

  public donateBookUser(bookId: string, donateBookUser: DonateBookUser) {
    return this._http.put<any>(`${config.apiEndpoint}/book/Donate/${bookId}`, donateBookUser);
  }

  public requestBook(bookId: string, reason: string) {
    return this._http.post<any>(`${config.apiEndpoint}/book/Request`, {bookId, reason});
  }

  public getRequested(bookId: string) {
    return this._http.get<any>(`${config.apiEndpoint}/book/Requested/${bookId}`);
  }

  public getRequestedBooks(page: number, items: number) {
    return this._http.get<any>(`${config.apiEndpoint}/book/MyRequests/${page}/${items}`);
  }

  public getDonatedBooks() {
    return this._http.get<any>(`${config.apiEndpoint}/book/MyDonations`);
  }
}
