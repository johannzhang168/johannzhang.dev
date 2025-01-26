
FROM golang:1.23 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest

WORKDIR /root/

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/main .

COPY --from=builder /app/.env .

COPY fullchain.pem /root/fullchain.pem

COPY privkey.pem /root/privkey.pem

EXPOSE 3000

CMD ["./main"]
