package com.location.service;
import java.util.List;
import java.util.Map;

public interface StatisticsService {
    double getTotalIncome();
    int getReservations();
    int getAvailableVehicles();
    double getOccupancyRate();
    public List<Map<String, Object>> getIncomeByMonth();
    List<Map<String, Object>> getVehicleRotation();
}
