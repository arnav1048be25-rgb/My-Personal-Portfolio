#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Room {
    int roomNumber;
    char type[20];
    float price;
    int isBooked;
};

struct Customer {
    char name[50];
    char phone[15];
    int roomNumber;
    int days;
};

// Function declarations
void addRoom();
void viewRooms();
void bookRoom();
void checkout();
void viewCustomers();
void showAvailableRooms();
void deleteRoom();

// File names
char roomFile[] = "rooms.dat";
char customerFile[] = "customers.dat";

int main() {
    int choice;

    while (1) {
        printf("\n===== HOTEL MANAGEMENT SYSTEM =====\n");
        printf("1. Add Room\n");
        printf("2. View Rooms\n");
        printf("3. Book Room\n");
        printf("4. Check Out\n");
        printf("5. View Customers\n");
        printf("6. Delete Room\n");
        printf("7. Exit\n");

        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1: addRoom(); break;
            case 2: viewRooms(); break;
            case 3: bookRoom(); break;
            case 4: checkout(); break;
            case 5: viewCustomers(); break;
            case 6: deleteRoom(); break;
            case 7: exit(0);
            default: printf("Invalid choice!\n");
        }
    }
}

// Add Room
void addRoom() {
    FILE *fp = fopen(roomFile, "ab");
    struct Room r;

    printf("Enter room number: ");
    scanf("%d", &r.roomNumber);

    printf("Enter room type (Single/Double): ");
    scanf("%s", r.type);

    printf("Enter price per day: ");
    scanf("%f", &r.price);

    r.isBooked = 0;

    fwrite(&r, sizeof(r), 1, fp);
    fclose(fp);

    printf("Room added successfully!\n");
}

//  Show Rooms
void showAvailableRooms() {
    FILE *fp = fopen(roomFile, "rb");
    struct Room r;
    int found = 0;

    printf("\nAvailable Rooms:\n");
    printf("RoomNo\tType\tPrice\n");

    while (fread(&r, sizeof(r), 1, fp)) {
        if (r.isBooked == 0) {
            printf("%d\t%s\t%.2f\n", r.roomNumber, r.type, r.price);
            found = 1;
        }
    }

    if (!found) {
        printf("No rooms available!\n");
    }

    fclose(fp);
}

//  Delete Rooms

void deleteRoom() {
    FILE *fp = fopen(roomFile, "rb");
    FILE *temp = fopen("temp.dat", "wb");

    struct Room r;
    int roomNo, found = 0;

    printf("Enter room number to delete: ");
    scanf("%d", &roomNo);

    while (fread(&r, sizeof(r), 1, fp)) {
        if (r.roomNumber == roomNo) {
            found = 1;   // skip this room (delete it)
        } else {
            fwrite(&r, sizeof(r), 1, temp);
        }
    }

    fclose(fp);
    fclose(temp);

    remove(roomFile);
    rename("temp.dat", roomFile);

    if (found)
        printf("Room deleted successfully!\n");
    else
        printf("Room not found!\n");
}

// View Rooms
void viewRooms() {
    FILE *fp = fopen(roomFile, "rb");
    struct Room r;

    printf("\n===== ROOM LIST =====\n");
    printf("RoomNo\tType\tPrice\tStatus\n");

    while (fread(&r, sizeof(r), 1, fp)) {
        printf("%d\t%s\t%.2f\t%s\n",
               r.roomNumber,
               r.type,
               r.price,
               r.isBooked ? "Booked" : "Available");
    }

    fclose(fp);
}

// Book Room
void bookRoom() {
    FILE *rf = fopen(roomFile, "rb+");
    FILE *cf = fopen(customerFile, "ab");

    struct Room r;
    struct Customer c;
    int found = 0;

    showAvailableRooms();  // 👈 NEW

    printf("\nEnter room number to book: ");
    scanf("%d", &c.roomNumber);

    rewind(rf);

    while (fread(&r, sizeof(r), 1, rf)) {
        if (r.roomNumber == c.roomNumber) {
            found = 1;

            if (r.isBooked == 1) {
                printf("Room already booked!\n");
                fclose(rf);
                fclose(cf);
                return;
            }

            r.isBooked = 1;
            fseek(rf, -sizeof(r), SEEK_CUR);
            fwrite(&r, sizeof(r), 1, rf);

            printf("Enter customer name: ");
            scanf("%s", c.name);

            printf("Enter phone: ");
            scanf("%s", c.phone);

            printf("Enter number of days: ");
            scanf("%d", &c.days);

            fwrite(&c, sizeof(c), 1, cf);

            printf("Room %d booked successfully!\n", c.roomNumber);
            break;
        }
    }

    if (!found) {
        printf("Invalid room number!\n");
    }

    fclose(rf);
    fclose(cf);
}

// Checkout
void checkout() {
    FILE *rf = fopen(roomFile, "rb+");
    FILE *cf = fopen(customerFile, "rb");
    FILE *temp = fopen("temp.dat", "wb");

    struct Room r;
    struct Customer c;
    int roomNo, found = 0;

    printf("Enter room number to checkout: ");
    scanf("%d", &roomNo);

    // Update room status
    while (fread(&r, sizeof(r), 1, rf)) {
        if (r.roomNumber == roomNo) {
            r.isBooked = 0;
            fseek(rf, -sizeof(r), SEEK_CUR);
            fwrite(&r, sizeof(r), 1, rf);
            break;
        }
    }

    // Remove customer & calculate bill
    while (fread(&c, sizeof(c), 1, cf)) {
        if (c.roomNumber == roomNo) {
            found = 1;

            // find room price again
            FILE *rf2 = fopen(roomFile, "rb");
            struct Room r2;
            float price = 0;

            while (fread(&r2, sizeof(r2), 1, rf2)) {
                if (r2.roomNumber == roomNo) {
                    price = r2.price;
                    break;
                }
            }
            fclose(rf2);

            float total = price * c.days;

            printf("\nGenerating bill...\n");

        printf("\n====================================\n");
        printf("           HOTEL BILL              \n");
        printf("====================================\n");

        printf("Customer Name   : %s\n", c.name);
        printf("Phone Number    : %s\n", c.phone);
        printf("Room Number     : %d\n", c.roomNumber);
        printf("Days Stayed     : %d\n", c.days);
        printf("Price per Day   : %.2f\n", price);
        printf("------------------------------------\n");
        printf("TOTAL AMOUNT    : %.2f\n", total);
        printf("====================================\n");
        printf("      Thank you for staying!       \n");
        printf("====================================\n");

            

        } else {
            fwrite(&c, sizeof(c), 1, temp);
        }
    }

    fclose(rf);
    fclose(cf);
    fclose(temp);

    remove(customerFile);
    rename("temp.dat", customerFile);

    if (!found) {
        printf("Customer not found!\n");
    } else {
        printf("Checkout successful!\n");
    }
}

// View Customers
void viewCustomers() {
    FILE *fp = fopen(customerFile, "rb");
    struct Customer c;

    printf("\nCustomer List:\n");
    printf("Name\tPhone\tRoom\tDays\n");

    while (fread(&c, sizeof(c), 1, fp)) {
        printf("%s\t%s\t%d\t%d\n",
               c.name,
               c.phone,
               c.roomNumber,
               c.days);
    }

    fclose(fp);
}